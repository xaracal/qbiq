from datetime import datetime

from beanie import Document
from pydantic import BaseModel, Field
from pymongo import ASCENDING, IndexModel


class ProductReview(BaseModel):
    author: str
    rating: int
    comment: str
    date: datetime


class Product(Document):
    id: str = Field(alias="_id")
    name: str
    price: float
    shortDescription: str
    longDescription: str
    category: str
    thumbnailUrl: str
    reviews: list[ProductReview] = Field(default_factory=list)

    class Settings:
        name = "products"
        indexes = [
            IndexModel([("category", ASCENDING)]),
            IndexModel([("price", ASCENDING)]),
            IndexModel([("name", ASCENDING)]),
        ]
