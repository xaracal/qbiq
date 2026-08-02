import json
import logging

from redis.asyncio import Redis

from app.core.exceptions import CartStorageUnavailableError
from app.models.schemas.cart import Cart

logger = logging.getLogger(__name__)


class CartRepository:
    def __init__(self, redis: Redis | None, ttl_seconds: int) -> None:
        self._redis = redis
        self._ttl_seconds = ttl_seconds

    @staticmethod
    def _cart_key(session_id: str) -> str:
        return f"cart:{session_id}"

    def _require_redis(self) -> Redis:
        if self._redis is None:
            raise CartStorageUnavailableError()
        return self._redis

    async def get_cart(self, session_id: str) -> Cart:
        redis = self._require_redis()
        try:
            raw = await redis.get(self._cart_key(session_id))
        except Exception as exc:
            logger.warning("Redis GET failed for cart session %s", session_id, exc_info=True)
            raise CartStorageUnavailableError() from exc

        if raw is None:
            return Cart()
        return Cart.model_validate_json(raw)

    async def save_cart(self, session_id: str, cart: Cart) -> Cart:
        redis = self._require_redis()
        try:
            await redis.setex(
                self._cart_key(session_id),
                self._ttl_seconds,
                json.dumps(cart.model_dump()),
            )
        except Exception as exc:
            logger.warning("Redis SET failed for cart session %s", session_id, exc_info=True)
            raise CartStorageUnavailableError() from exc
        return cart

    async def delete_cart(self, session_id: str) -> None:
        redis = self._require_redis()
        try:
            await redis.delete(self._cart_key(session_id))
        except Exception as exc:
            logger.warning("Redis DELETE failed for cart session %s", session_id, exc_info=True)
            raise CartStorageUnavailableError() from exc
