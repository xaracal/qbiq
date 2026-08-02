from unittest.mock import AsyncMock

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.routes.products import router as products_router
from app.core.exceptions import ProductNotFoundError


def test_get_product_returns_404_for_unknown_id() -> None:
    mock_service = AsyncMock()
    mock_service.get_product.side_effect = ProductNotFoundError("unknown-id")

    test_app = FastAPI()
    test_app.state.product_service = mock_service
    test_app.include_router(products_router)

    with TestClient(test_app) as client:
        response = client.get("/api/products/unknown-id")
        assert response.status_code == 404
        assert "unknown-id" in response.json()["detail"]
