from app.models.documents.order import Order as OrderDocument
from app.models.schemas.order import Order, OrderItem


class OrderRepository:
    @staticmethod
    def _to_schema(document: OrderDocument) -> Order:
        return Order(
            id=document.id,
            sessionId=document.sessionId,
            items=[OrderItem.model_validate(item.model_dump()) for item in document.items],
            total=document.total,
            status=document.status,
            createdAt=document.createdAt,
        )

    async def create_order(self, order: OrderDocument) -> Order:
        await order.insert()
        return self._to_schema(order)

    async def get_by_id(self, order_id: str) -> Order | None:
        document = await OrderDocument.get(order_id)
        if document is None:
            return None
        return self._to_schema(document)
