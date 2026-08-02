from fastapi import APIRouter, Depends, Header, HTTPException, Request

from app.core.exceptions import (
    CartStorageUnavailableError,
    EmptyCartError,
    OrderNotFoundError,
)
from app.models.schemas.order import Order
from app.services.checkout_service import CheckoutService

router = APIRouter(tags=["checkout"])


def get_checkout_service(request: Request) -> CheckoutService:
    return request.app.state.checkout_service


def require_session_id(
    x_cart_session_id: str | None = Header(default=None, alias="X-Cart-Session-Id"),
) -> str:
    if not x_cart_session_id:
        raise HTTPException(status_code=400, detail="X-Cart-Session-Id header is required")
    return x_cart_session_id


def _handle_checkout_errors(exc: Exception) -> HTTPException:
    if isinstance(exc, EmptyCartError):
        return HTTPException(status_code=400, detail=str(exc))
    if isinstance(exc, OrderNotFoundError):
        return HTTPException(status_code=404, detail=str(exc))
    if isinstance(exc, CartStorageUnavailableError):
        return HTTPException(status_code=503, detail=str(exc))
    raise exc


@router.post("/api/checkout", response_model=Order)
async def checkout(
    session_id: str = Depends(require_session_id),
    service: CheckoutService = Depends(get_checkout_service),
) -> Order:
    try:
        return await service.checkout(session_id)
    except Exception as exc:
        raise _handle_checkout_errors(exc) from exc


@router.get("/api/orders/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    session_id: str = Depends(require_session_id),
    service: CheckoutService = Depends(get_checkout_service),
) -> Order:
    try:
        return await service.get_order(session_id, order_id)
    except Exception as exc:
        raise _handle_checkout_errors(exc) from exc
