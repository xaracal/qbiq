import asyncio
from datetime import UTC, datetime
from unittest.mock import AsyncMock

import pytest

from app.core.exceptions import EmptyCartError, OrderNotFoundError
from app.models.schemas.cart import Cart, CartItem
from app.models.schemas.order import Order, OrderItem
from app.repositories.cart_repository import CartRepository
from app.repositories.order_repository import OrderRepository
from app.services.checkout_service import CheckoutService


@pytest.fixture
def service() -> CheckoutService:
    cart_repository = AsyncMock(spec=CartRepository)
    order_repository = AsyncMock(spec=OrderRepository)
    return CheckoutService(
        cart_repository=cart_repository,
        order_repository=order_repository,
    )


def _sample_cart() -> Cart:
    return Cart(
        items=[
            CartItem(
                productId="prod-1",
                name="Sample Product",
                price=19.99,
                quantity=2,
                thumbnailUrl="https://example.com/img.png",
            )
        ],
        total=39.98,
    )


def _sample_order() -> Order:
    return Order(
        id="order-1",
        sessionId="session-1",
        items=[
            OrderItem(
                productId="prod-1",
                name="Sample Product",
                price=19.99,
                quantity=2,
                thumbnailUrl="https://example.com/img.png",
            )
        ],
        total=39.98,
        status="completed",
        createdAt=datetime.now(UTC),
    )


def test_checkout_raises_for_empty_cart(service: CheckoutService) -> None:
    service._cart_repository.get_cart = AsyncMock(return_value=Cart())

    with pytest.raises(EmptyCartError):
        asyncio.run(service.checkout("session-1"))


def test_checkout_creates_order_and_clears_cart(service: CheckoutService) -> None:
    service._cart_repository.get_cart = AsyncMock(return_value=_sample_cart())
    service._order_repository.create_order = AsyncMock(side_effect=lambda order: _sample_order())

    result = asyncio.run(service.checkout("session-1"))

    service._order_repository.create_order.assert_awaited_once()
    service._cart_repository.delete_cart.assert_awaited_once_with("session-1")
    assert result.id == "order-1"
    assert result.total == 39.98
    assert len(result.items) == 1


def test_get_order_returns_order_for_matching_session(service: CheckoutService) -> None:
    service._order_repository.get_by_id = AsyncMock(return_value=_sample_order())

    result = asyncio.run(service.get_order("session-1", "order-1"))

    assert result.id == "order-1"
    assert result.sessionId == "session-1"


def test_get_order_raises_for_wrong_session(service: CheckoutService) -> None:
    service._order_repository.get_by_id = AsyncMock(return_value=_sample_order())

    with pytest.raises(OrderNotFoundError):
        asyncio.run(service.get_order("other-session", "order-1"))


def test_get_order_raises_for_missing_order(service: CheckoutService) -> None:
    service._order_repository.get_by_id = AsyncMock(return_value=None)

    with pytest.raises(OrderNotFoundError):
        asyncio.run(service.get_order("session-1", "missing-order"))
