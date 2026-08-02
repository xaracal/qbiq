from beanie import SortDirection

from app.models.documents.product import Product
from app.models.schemas.product import ProductListParams


class ProductRepository:
    @staticmethod
    def _build_filter(params: ProductListParams) -> dict:
        query: dict = {}
        if params.name:
            query["name"] = {"$regex": params.name, "$options": "i"}
        if params.category:
            query["category"] = params.category
        return query

    @staticmethod
    def _build_sort(params: ProductListParams) -> list[tuple[str, SortDirection]]:
        sort_field = params.sort_by or "name"
        direction = SortDirection.DESCENDING if params.sort_order == "desc" else SortDirection.ASCENDING
        return [(sort_field, direction)]

    async def find_products(self, params: ProductListParams) -> list[Product]:
        query = self._build_filter(params)
        sort = self._build_sort(params)
        return await Product.find(query).sort(sort).to_list()

    async def get_by_id(self, product_id: str) -> Product | None:
        return await Product.get(product_id)
