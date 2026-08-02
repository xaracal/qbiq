from fastapi import APIRouter, Depends, Header, HTTPException, Request

from app.core.exceptions import (
    CartItemNotFoundError,
    CartStorageUnavailableError,
    ProductNotFoundError,
)
from app.models.schemas.cart import AddToCartRequest, Cart, UpdateQuantityRequest
from app.services.cart_service import CartService

router = APIRouter(prefix="/api/cart", tags=["cart"])


def get_cart_service(request: Request) -> CartService:
    return request.app.state.cart_service


def require_session_id(
    x_cart_session_id: str | None = Header(default=None, alias="X-Cart-Session-Id"),
) -> str:
    if not x_cart_session_id:
        raise HTTPException(status_code=400, detail="X-Cart-Session-Id header is required")
    return x_cart_session_id


def _handle_cart_errors(exc: Exception) -> HTTPException:
    if isinstance(exc, ProductNotFoundError | CartItemNotFoundError):
        return HTTPException(status_code=404, detail=str(exc))
    if isinstance(exc, CartStorageUnavailableError):
        return HTTPException(status_code=503, detail=str(exc))
    raise exc


@router.get("", response_model=Cart)
async def get_cart(
    session_id: str = Depends(require_session_id),
    service: CartService = Depends(get_cart_service),
) -> Cart:
    try:
        return await service.get_cart(session_id)
    except Exception as exc:
        raise _handle_cart_errors(exc) from exc


@router.post("/items", response_model=Cart)
async def add_cart_item(
    request: AddToCartRequest,
    session_id: str = Depends(require_session_id),
    service: CartService = Depends(get_cart_service),
) -> Cart:
    try:
        return await service.add_item(session_id, request)
    except Exception as exc:
        raise _handle_cart_errors(exc) from exc


@router.patch("/items/{product_id}", response_model=Cart)
async def update_cart_item_quantity(
    product_id: str,
    request: UpdateQuantityRequest,
    session_id: str = Depends(require_session_id),
    service: CartService = Depends(get_cart_service),
) -> Cart:
    try:
        return await service.update_quantity(session_id, product_id, request)
    except Exception as exc:
        raise _handle_cart_errors(exc) from exc


@router.delete("/items/{product_id}", response_model=Cart)
async def remove_cart_item(
    product_id: str,
    session_id: str = Depends(require_session_id),
    service: CartService = Depends(get_cart_service),
) -> Cart:
    try:
        return await service.remove_item(session_id, product_id)
    except Exception as exc:
        raise _handle_cart_errors(exc) from exc


@router.delete("", response_model=Cart)
async def clear_cart(
    session_id: str = Depends(require_session_id),
    service: CartService = Depends(get_cart_service),
) -> Cart:
    try:
        return await service.clear_cart(session_id)
    except Exception as exc:
        raise _handle_cart_errors(exc) from exc
