from datetime import UTC, datetime
from unittest.mock import AsyncMock

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.routes.checkout import router as checkout_router
from app.core.exceptions import EmptyCartError, OrderNotFoundError
from app.models.schemas.order import Order, OrderItem


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


def test_checkout_requires_session_header() -> None:
    test_app = FastAPI()
    test_app.state.checkout_service = AsyncMock()
    test_app.include_router(checkout_router)

    with TestClient(test_app) as client:
        response = client.post("/api/checkout")
        assert response.status_code == 400
        assert "X-Cart-Session-Id" in response.json()["detail"]


def test_checkout_returns_400_for_empty_cart() -> None:
    mock_service = AsyncMock()
    mock_service.checkout.side_effect = EmptyCartError()

    test_app = FastAPI()
    test_app.state.checkout_service = mock_service
    test_app.include_router(checkout_router)

    with TestClient(test_app) as client:
        response = client.post("/api/checkout", headers={"X-Cart-Session-Id": "session-1"})
        assert response.status_code == 400
        assert "empty" in response.json()["detail"].lower()


def test_checkout_returns_order() -> None:
    mock_service = AsyncMock()
    mock_service.checkout.return_value = _sample_order()

    test_app = FastAPI()
    test_app.state.checkout_service = mock_service
    test_app.include_router(checkout_router)

    with TestClient(test_app) as client:
        response = client.post("/api/checkout", headers={"X-Cart-Session-Id": "session-1"})
        assert response.status_code == 200
        body = response.json()
        assert body["id"] == "order-1"
        assert body["total"] == 39.98
        assert len(body["items"]) == 1


def test_get_order_requires_session_header() -> None:
    test_app = FastAPI()
    test_app.state.checkout_service = AsyncMock()
    test_app.include_router(checkout_router)

    with TestClient(test_app) as client:
        response = client.get("/api/orders/order-1")
        assert response.status_code == 400
        assert "X-Cart-Session-Id" in response.json()["detail"]


def test_get_order_returns_404_for_missing_order() -> None:
    mock_service = AsyncMock()
    mock_service.get_order.side_effect = OrderNotFoundError("missing-order")

    test_app = FastAPI()
    test_app.state.checkout_service = mock_service
    test_app.include_router(checkout_router)

    with TestClient(test_app) as client:
        response = client.get(
            "/api/orders/missing-order",
            headers={"X-Cart-Session-Id": "session-1"},
        )
        assert response.status_code == 404
        assert "missing-order" in response.json()["detail"]


def test_get_order_returns_order() -> None:
    mock_service = AsyncMock()
    mock_service.get_order.return_value = _sample_order()

    test_app = FastAPI()
    test_app.state.checkout_service = mock_service
    test_app.include_router(checkout_router)

    with TestClient(test_app) as client:
        response = client.get(
            "/api/orders/order-1",
            headers={"X-Cart-Session-Id": "session-1"},
        )
        assert response.status_code == 200
        body = response.json()
        assert body["id"] == "order-1"
        assert body["sessionId"] == "session-1"
