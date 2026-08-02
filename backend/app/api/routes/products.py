from fastapi import APIRouter, Depends, HTTPException, Query, Request

from app.core.exceptions import ProductNotFoundError
from app.models.schemas.product import ProductDetail, ProductListParams, ProductSummary
from app.services.product_service import ProductService

router = APIRouter(prefix="/api/products", tags=["products"])


def get_product_service(request: Request) -> ProductService:
    return request.app.state.product_service


@router.get("", response_model=list[ProductSummary])
async def list_products(
    name: str | None = Query(default=None),
    category: str | None = Query(default=None),
    sort_by: str | None = Query(default=None, pattern="^(price|name)$"),
    sort_order: str = Query(default="asc", pattern="^(asc|desc)$"),
    service: ProductService = Depends(get_product_service),
) -> list[ProductSummary]:
    params = ProductListParams(
        name=name,
        category=category,
        sort_by=sort_by,  # type: ignore[arg-type]
        sort_order=sort_order,  # type: ignore[arg-type]
    )
    return await service.list_products(params)


@router.get("/{product_id}", response_model=ProductDetail)
async def get_product(
    product_id: str,
    service: ProductService = Depends(get_product_service),
) -> ProductDetail:
    try:
        return await service.get_product(product_id)
    except ProductNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
