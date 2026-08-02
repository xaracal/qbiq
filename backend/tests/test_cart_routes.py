from unittest.mock import AsyncMock

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.routes.cart import router as cart_router
from app.core.exceptions import ProductNotFoundError
from app.models.schemas.cart import Cart, CartItem


def test_get_cart_requires_session_header() -> None:
    test_app = FastAPI()
    test_app.state.cart_service = AsyncMock()
    test_app.include_router(cart_router)

    with TestClient(test_app) as client:
        response = client.get("/api/cart")
        assert response.status_code == 400
        assert "X-Cart-Session-Id" in response.json()["detail"]


def test_add_cart_item_returns_404_for_unknown_product() -> None:
    mock_service = AsyncMock()
    mock_service.add_item.side_effect = ProductNotFoundError("unknown-id")

    test_app = FastAPI()
    test_app.state.cart_service = mock_service
    test_app.include_router(cart_router)

    with TestClient(test_app) as client:
        response = client.post(
            "/api/cart/items",
            headers={"X-Cart-Session-Id": "session-1"},
            json={"productId": "unknown-id", "quantity": 1},
        )
        assert response.status_code == 404
        assert "unknown-id" in response.json()["detail"]


def test_get_cart_returns_cart_with_session_header() -> None:
    mock_service = AsyncMock()
    mock_service.get_cart.return_value = Cart(
        items=[
            CartItem(
                productId="prod-1",
                name="Sample",
                price=10.0,
                quantity=2,
                thumbnailUrl="https://example.com/img.png",
            )
        ],
        total=20.0,
    )

    test_app = FastAPI()
    test_app.state.cart_service = mock_service
    test_app.include_router(cart_router)

    with TestClient(test_app) as client:
        response = client.get("/api/cart", headers={"X-Cart-Session-Id": "session-1"})
        assert response.status_code == 200
        body = response.json()
        assert body["total"] == 20.0
        assert len(body["items"]) == 1
