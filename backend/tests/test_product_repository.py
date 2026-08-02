from beanie import SortDirection

from app.models.schemas.product import ProductListParams
from app.repositories.product_repository import ProductRepository


def test_build_filter_with_name_and_category() -> None:
    params = ProductListParams(name="python", category="ebook")
    query = ProductRepository._build_filter(params)

    assert query["name"] == {"$regex": "python", "$options": "i"}
    assert query["category"] == "ebook"


def test_build_filter_empty_params() -> None:
    params = ProductListParams()
    assert ProductRepository._build_filter(params) == {}


def test_build_sort_defaults_to_name_asc() -> None:
    params = ProductListParams()
    sort = ProductRepository._build_sort(params)

    assert sort == [("name", SortDirection.ASCENDING)]


def test_build_sort_price_desc() -> None:
    params = ProductListParams(sort_by="price", sort_order="desc")
    sort = ProductRepository._build_sort(params)

    assert sort == [("price", SortDirection.DESCENDING)]
