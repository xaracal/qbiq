from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    thumbnailUrl: str


class Order(BaseModel):
    id: str
    sessionId: str
    items: list[OrderItem]
    total: float
    status: Literal["completed"]
    createdAt: datetime
