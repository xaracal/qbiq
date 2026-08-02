import asyncio
from unittest.mock import AsyncMock

import pytest

from app.core.exceptions import CartItemNotFoundError, ProductNotFoundError
from app.models.documents.product import Product
from app.models.schemas.cart import AddToCartRequest, Cart, CartItem, UpdateQuantityRequest
from app.repositories.cart_repository import CartRepository
from app.repositories.product_repository import ProductRepository
from app.services.cart_service import CartService


def _sample_product() -> Product:
    return Product.model_construct(
        id="prod-1",
        name="Sample Product",
        price=19.99,
        shortDescription="Short",
        longDescription="Long",
        category="ebook",
        thumbnailUrl="https://example.com/img.png",
        reviews=[],
    )


@pytest.fixture
def service() -> CartService:
    cart_repository = AsyncMock(spec=CartRepository)
    product_repository = AsyncMock(spec=ProductRepository)
    cart_service = CartService(
        cart_repository=cart_repository,
        product_repository=product_repository,
    )
    cart_service._cart_repository.get_cart = AsyncMock(return_value=Cart())
    cart_service._cart_repository.save_cart = AsyncMock(side_effect=lambda _session_id, cart: cart)
    cart_service._cart_repository.delete_cart = AsyncMock()
    return cart_service


def test_get_cart_returns_empty_cart_with_zero_total(service: CartService) -> None:
    result = asyncio.run(service.get_cart("session-1"))

    assert result.items == []
    assert result.total == 0.0


def test_add_item_creates_new_line_item(service: CartService) -> None:
    service._product_repository.get_by_id = AsyncMock(return_value=_sample_product())

    result = asyncio.run(
        service.add_item("session-1", AddToCartRequest(productId="prod-1", quantity=2))
    )

    assert len(result.items) == 1
    assert result.items[0].productId == "prod-1"
    assert result.items[0].quantity == 2
    assert result.total == 39.98


def test_add_item_increments_existing_quantity(service: CartService) -> None:
    service._product_repository.get_by_id = AsyncMock(return_value=_sample_product())
    service._cart_repository.get_cart = AsyncMock(
        return_value=Cart(
            items=[
                CartItem(
                    productId="prod-1",
                    name="Sample Product",
                    price=19.99,
                    quantity=1,
                    thumbnailUrl="https://example.com/img.png",
                )
            ]
        )
    )

    result = asyncio.run(
        service.add_item("session-1", AddToCartRequest(productId="prod-1", quantity=2))
    )

    assert len(result.items) == 1
    assert result.items[0].quantity == 3
    assert result.total == 59.97


def test_add_item_raises_for_unknown_product(service: CartService) -> None:
    service._product_repository.get_by_id = AsyncMock(return_value=None)

    with pytest.raises(ProductNotFoundError):
        asyncio.run(service.add_item("session-1", AddToCartRequest(productId="missing")))


def test_update_quantity_removes_item_when_zero(service: CartService) -> None:
    service._cart_repository.get_cart = AsyncMock(
        return_value=Cart(
            items=[
                CartItem(
                    productId="prod-1",
                    name="Sample Product",
                    price=19.99,
                    quantity=2,
                    thumbnailUrl="https://example.com/img.png",
                )
            ]
        )
    )

    result = asyncio.run(
        service.update_quantity("session-1", "prod-1", UpdateQuantityRequest(quantity=0))
    )

    assert result.items == []
    assert result.total == 0.0


def test_update_quantity_raises_for_missing_item(service: CartService) -> None:
    with pytest.raises(CartItemNotFoundError):
        asyncio.run(
            service.update_quantity("session-1", "missing", UpdateQuantityRequest(quantity=1))
        )


def test_remove_item(service: CartService) -> None:
    service._cart_repository.get_cart = AsyncMock(
        return_value=Cart(
            items=[
                CartItem(
                    productId="prod-1",
                    name="Sample Product",
                    price=19.99,
                    quantity=1,
                    thumbnailUrl="https://example.com/img.png",
                )
            ]
        )
    )

    result = asyncio.run(service.remove_item("session-1", "prod-1"))

    assert result.items == []
    assert result.total == 0.0


def test_clear_cart(service: CartService) -> None:
    result = asyncio.run(service.clear_cart("session-1"))

    service._cart_repository.delete_cart.assert_awaited_once_with("session-1")
    assert result.items == []
    assert result.total == 0.0
