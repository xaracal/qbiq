import asyncio

import pytest
from beanie import init_beanie
from fastapi.testclient import TestClient
from pymongo import AsyncMongoClient

from app.core.config import settings
from app.main import app
from app.models.documents.product import Product


def _mongo_available() -> bool:
    async def ping() -> bool:
        client = AsyncMongoClient(settings.mongodb_url, serverSelectionTimeoutMS=2000)
        try:
            await client.admin.command("ping")
            return True
        except Exception:
            return False
        finally:
            await client.close()

    return asyncio.run(ping())


async def _reset_products() -> None:
    client = AsyncMongoClient(settings.mongodb_url)
    await init_beanie(database=client[settings.mongodb_db_name], document_models=[Product])
    await Product.delete_all()
    await client.close()


@pytest.fixture(scope="module")
def seeded_client() -> TestClient:
    if not _mongo_available():
        pytest.skip("MongoDB is not available")

    asyncio.run(_reset_products())

    with TestClient(app) as client:
        yield client

    asyncio.run(_reset_products())


def test_list_products_filter_by_category(seeded_client: TestClient) -> None:
    response = seeded_client.get("/api/products", params={"category": "ebook"})
    assert response.status_code == 200
    products = response.json()
    assert len(products) >= 1
    assert all("shortDescription" in item for item in products)


def test_list_products_sort_by_price_desc(seeded_client: TestClient) -> None:
    response = seeded_client.get(
        "/api/products",
        params={"sort_by": "price", "sort_order": "desc"},
    )
    assert response.status_code == 200
    prices = [item["price"] for item in response.json()]
    assert prices == sorted(prices, reverse=True)


def test_get_product_detail(seeded_client: TestClient) -> None:
    response = seeded_client.get("/api/products/ebook-python-mastery")
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == "ebook-python-mastery"
    assert body["category"] == "ebook"
    assert len(body["reviews"]) >= 1
