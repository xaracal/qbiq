from datetime import UTC, datetime
from uuid import uuid4

from app.core.exceptions import EmptyCartError, OrderNotFoundError
from app.models.documents.order import Order as OrderDocument
from app.models.documents.order import OrderItem
from app.models.schemas.order import Order
from app.repositories.cart_repository import CartRepository
from app.repositories.order_repository import OrderRepository


class CheckoutService:
    def __init__(
        self,
        cart_repository: CartRepository,
        order_repository: OrderRepository,
    ) -> None:
        self._cart_repository = cart_repository
        self._order_repository = order_repository

    async def checkout(self, session_id: str) -> Order:
        cart = await self._cart_repository.get_cart(session_id)
        if not cart.items:
            raise EmptyCartError()

        order = OrderDocument.model_construct(
            id=str(uuid4()),
            sessionId=session_id,
            items=[
                OrderItem(
                    productId=item.productId,
                    name=item.name,
                    price=item.price,
                    quantity=item.quantity,
                    thumbnailUrl=item.thumbnailUrl,
                )
                for item in cart.items
            ],
            total=cart.total,
            status="completed",
            createdAt=datetime.now(UTC),
        )
        created = await self._order_repository.create_order(order)
        await self._cart_repository.delete_cart(session_id)
        return created

    async def get_order(self, session_id: str, order_id: str) -> Order:
        order = await self._order_repository.get_by_id(order_id)
        if order is None or order.sessionId != session_id:
            raise OrderNotFoundError(order_id)
        return order
