import asyncio
from datetime import datetime, timezone
from unittest.mock import AsyncMock

import pytest

from app.core.cache import CacheService
from app.core.exceptions import ProductNotFoundError
from app.models.documents.product import Product, ProductReview
from app.models.schemas.product import ProductListParams
from app.repositories.product_repository import ProductRepository
from app.services.product_service import ProductService


def _sample_product() -> Product:
    return Product.model_construct(
        id="prod-1",
        name="Sample Product",
        price=19.99,
        shortDescription="Short",
        longDescription="Long description",
        category="ebook",
        thumbnailUrl="https://example.com/img.png",
        reviews=[
            ProductReview(
                author="Tester",
                rating=5,
                comment="Great",
                date=datetime(2025, 1, 1, tzinfo=timezone.utc),
            )
        ],
    )


@pytest.fixture
def service() -> ProductService:
    repository = AsyncMock(spec=ProductRepository)
    cache = CacheService(redis=None, ttl_seconds=300)
    return ProductService(repository=repository, cache=cache)


def test_list_products_maps_repository_results_to_summaries(service: ProductService) -> None:
    product = _sample_product()
    service._repository.find_products = AsyncMock(return_value=[product])

    result = asyncio.run(service.list_products(ProductListParams()))

    assert len(result) == 1
    assert result[0].id == "prod-1"
    assert result[0].name == "Sample Product"
    assert result[0].price == 19.99
    assert result[0].shortDescription == "Short"
    assert "longDescription" not in result[0].model_dump()


def test_list_products_passes_filter_and_sort_params(service: ProductService) -> None:
    service._repository.find_products = AsyncMock(return_value=[])
    params = ProductListParams(name="vue", category="course", sort_by="price", sort_order="desc")

    asyncio.run(service.list_products(params))

    service._repository.find_products.assert_awaited_once_with(params)


def test_get_product_raises_when_missing(service: ProductService) -> None:
    service._repository.get_by_id = AsyncMock(return_value=None)

    with pytest.raises(ProductNotFoundError):
        asyncio.run(service.get_product("missing-id"))


def test_get_product_returns_detail(service: ProductService) -> None:
    product = _sample_product()
    service._repository.get_by_id = AsyncMock(return_value=product)

    detail = asyncio.run(service.get_product("prod-1"))

    assert detail.longDescription == "Long description"
    assert detail.category == "ebook"
    assert len(detail.reviews) == 1
