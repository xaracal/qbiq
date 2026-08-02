class ProductNotFoundError(Exception):
    def __init__(self, product_id: str) -> None:
        self.product_id = product_id
        super().__init__(f"Product not found: {product_id}")


class CartItemNotFoundError(Exception):
    def __init__(self, product_id: str) -> None:
        self.product_id = product_id
        super().__init__(f"Cart item not found: {product_id}")


class CartStorageUnavailableError(Exception):
    def __init__(self) -> None:
        super().__init__("Cart storage is unavailable")


class EmptyCartError(Exception):
    def __init__(self) -> None:
        super().__init__("Cart is empty")


class OrderNotFoundError(Exception):
    def __init__(self, order_id: str) -> None:
        self.order_id = order_id
        super().__init__(f"Order not found: {order_id}")
