from datetime import UTC, datetime
from typing import Literal

from beanie import Document
from pydantic import BaseModel, Field
from pymongo import ASCENDING, IndexModel


class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    thumbnailUrl: str


class Order(Document):
    id: str = Field(alias="_id")
    sessionId: str
    items: list[OrderItem]
    total: float
    status: Literal["completed"] = "completed"
    createdAt: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "orders"
        indexes = [
            IndexModel([("sessionId", ASCENDING)]),
        ]
