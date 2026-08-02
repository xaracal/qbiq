import json
import logging
from pathlib import Path

from app.models.documents.product import Product

logger = logging.getLogger(__name__)

SEED_FILE = Path(__file__).resolve().parents[2] / "data" / "products.json"


async def seed_products_if_empty() -> None:
    count = await Product.count()
    if count > 0:
        logger.info("Products collection already seeded (%s documents)", count)
        return

    if not SEED_FILE.exists():
        logger.warning("Seed file not found at %s", SEED_FILE)
        return

    with SEED_FILE.open(encoding="utf-8") as handle:
        raw_products = json.load(handle)

    products = [Product.model_validate(item) for item in raw_products]
    await Product.insert_many(products)
    logger.info("Seeded %s products from %s", len(products), SEED_FILE)
