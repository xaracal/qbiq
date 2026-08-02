from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
import logging

from beanie import init_beanie
from fastapi import FastAPI
from pymongo import AsyncMongoClient
from redis.asyncio import Redis

from app.core.cache import CacheService
from app.core.config import settings
from app.models.documents.order import Order
from app.models.documents.product import Product
from app.repositories.cart_repository import CartRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.product_repository import ProductRepository
from app.seed.products import seed_products_if_empty
from app.services.cart_service import CartService
from app.services.checkout_service import CheckoutService
from app.services.product_service import ProductService

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    mongo_client = AsyncMongoClient(settings.mongodb_url)
    await init_beanie(
        database=mongo_client[settings.mongodb_db_name],
        document_models=[Product, Order],
    )
    await seed_products_if_empty()

    redis_client: Redis | None = None
    try:
        redis_client = Redis.from_url(settings.redis_url, decode_responses=True)
        await redis_client.ping()
    except Exception:
        logger.warning("Redis unavailable; continuing without cache", exc_info=True)
        if redis_client is not None:
            await redis_client.aclose()
        redis_client = None

    cache = CacheService(redis=redis_client, ttl_seconds=settings.cache_ttl_seconds)
    product_repository = ProductRepository()
    product_service = ProductService(repository=product_repository, cache=cache)
    cart_repository = CartRepository(redis=redis_client, ttl_seconds=settings.cart_session_ttl_seconds)
    order_repository = OrderRepository()
    cart_service = CartService(
        cart_repository=cart_repository,
        product_repository=product_repository,
    )
    checkout_service = CheckoutService(
        cart_repository=cart_repository,
        order_repository=order_repository,
    )

    app.state.mongo_client = mongo_client
    app.state.redis_client = redis_client
    app.state.product_service = product_service
    app.state.cart_service = cart_service
    app.state.checkout_service = checkout_service

    yield

    if redis_client is not None:
        await redis_client.aclose()
    await mongo_client.close()
