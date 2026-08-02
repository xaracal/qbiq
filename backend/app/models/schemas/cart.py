from pydantic import BaseModel, Field


class CartItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    thumbnailUrl: str


class Cart(BaseModel):
    items: list[CartItem] = Field(default_factory=list)
    total: float = 0.0


class AddToCartRequest(BaseModel):
    productId: str
    quantity: int = Field(default=1, ge=1)


class UpdateQuantityRequest(BaseModel):
    quantity: int = Field(ge=0)
