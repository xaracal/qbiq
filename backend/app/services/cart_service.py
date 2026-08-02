from app.core.exceptions import CartItemNotFoundError, ProductNotFoundError
from app.models.schemas.cart import AddToCartRequest, Cart, CartItem, UpdateQuantityRequest
from app.repositories.cart_repository import CartRepository
from app.repositories.product_repository import ProductRepository


class CartService:
    def __init__(
        self,
        cart_repository: CartRepository,
        product_repository: ProductRepository,
    ) -> None:
        self._cart_repository = cart_repository
        self._product_repository = product_repository

    @staticmethod
    def _compute_total(items: list[CartItem]) -> float:
        return round(sum(item.price * item.quantity for item in items), 2)

    @staticmethod
    def _finalize(cart: Cart) -> Cart:
        cart.total = CartService._compute_total(cart.items)
        return cart

    async def get_cart(self, session_id: str) -> Cart:
        cart = await self._cart_repository.get_cart(session_id)
        return self._finalize(cart)

    async def add_item(self, session_id: str, request: AddToCartRequest) -> Cart:
        product = await self._product_repository.get_by_id(request.productId)
        if product is None:
            raise ProductNotFoundError(request.productId)

        cart = await self._cart_repository.get_cart(session_id)
        for item in cart.items:
            if item.productId == request.productId:
                item.quantity += request.quantity
                return await self._cart_repository.save_cart(session_id, self._finalize(cart))

        cart.items.append(
            CartItem(
                productId=product.id,
                name=product.name,
                price=product.price,
                quantity=request.quantity,
                thumbnailUrl=product.thumbnailUrl,
            )
        )
        return await self._cart_repository.save_cart(session_id, self._finalize(cart))

    async def update_quantity(
        self,
        session_id: str,
        product_id: str,
        request: UpdateQuantityRequest,
    ) -> Cart:
        cart = await self._cart_repository.get_cart(session_id)
        for index, item in enumerate(cart.items):
            if item.productId != product_id:
                continue
            if request.quantity <= 0:
                cart.items.pop(index)
            else:
                item.quantity = request.quantity
            return await self._cart_repository.save_cart(session_id, self._finalize(cart))

        raise CartItemNotFoundError(product_id)

    async def remove_item(self, session_id: str, product_id: str) -> Cart:
        cart = await self._cart_repository.get_cart(session_id)
        original_length = len(cart.items)
        cart.items = [item for item in cart.items if item.productId != product_id]
        if len(cart.items) == original_length:
            raise CartItemNotFoundError(product_id)
        return await self._cart_repository.save_cart(session_id, self._finalize(cart))

    async def clear_cart(self, session_id: str) -> Cart:
        await self._cart_repository.delete_cart(session_id)
        return Cart()
