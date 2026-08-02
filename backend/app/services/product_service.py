import json

from app.core.cache import CacheService
from app.core.exceptions import ProductNotFoundError
from app.models.documents.product import Product
from app.models.schemas.product import ProductDetail, ProductListParams, ProductSummary
from app.repositories.product_repository import ProductRepository


class ProductService:
    def __init__(self, repository: ProductRepository, cache: CacheService) -> None:
        self._repository = repository
        self._cache = cache

    @staticmethod
    def _to_summary(product: Product) -> ProductSummary:
        return ProductSummary(
            id=product.id,
            name=product.name,
            price=product.price,
            shortDescription=product.shortDescription,
            thumbnailUrl=product.thumbnailUrl,
        )

    @staticmethod
    def _to_detail(product: Product) -> ProductDetail:
        return ProductDetail(
            id=product.id,
            name=product.name,
            price=product.price,
            shortDescription=product.shortDescription,
            thumbnailUrl=product.thumbnailUrl,
            longDescription=product.longDescription,
            category=product.category,
            reviews=[review.model_dump() for review in product.reviews],
        )

    async def list_products(self, params: ProductListParams) -> list[ProductSummary]:
        cache_key = self._cache.list_key(params.model_dump(exclude_none=True))
        cached = await self._cache.get(cache_key)
        if cached is not None:
            data = json.loads(cached)
            return [ProductSummary.model_validate(item) for item in data]

        products = await self._repository.find_products(params)
        summaries = [self._to_summary(product) for product in products]
        await self._cache.set(cache_key, json.dumps([item.model_dump(mode="json") for item in summaries]))
        return summaries

    async def get_product(self, product_id: str) -> ProductDetail:
        cache_key = self._cache.detail_key(product_id)
        cached = await self._cache.get(cache_key)
        if cached is not None:
            return ProductDetail.model_validate_json(cached)

        product = await self._repository.get_by_id(product_id)
        if product is None:
            raise ProductNotFoundError(product_id)

        detail = self._to_detail(product)
        await self._cache.set(cache_key, detail.model_dump_json())
        return detail
