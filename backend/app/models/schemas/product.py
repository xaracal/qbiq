from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ProductReviewSchema(BaseModel):
    author: str
    rating: int
    comment: str
    date: datetime


class ProductSummary(BaseModel):
    id: str
    name: str
    price: float
    shortDescription: str
    thumbnailUrl: str


class ProductDetail(ProductSummary):
    longDescription: str
    category: str
    reviews: list[ProductReviewSchema] = Field(default_factory=list)


class ProductListParams(BaseModel):
    name: str | None = None
    category: str | None = None
    sort_by: Literal["price", "name"] | None = None
    sort_order: Literal["asc", "desc"] = "asc"
