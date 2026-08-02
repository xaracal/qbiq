import { apiClient, withGetRetry, withMutationRetry } from '@/api/client'
import type { AddToCartPayload, Cart, UpdateCartQuantityPayload } from '@/types'

export async function fetchCart(): Promise<Cart> {
  const response = await withGetRetry(() => apiClient.get<Cart>('/cart'))
  return response.data
}

export async function addCartItem(payload: AddToCartPayload): Promise<Cart> {
  const response = await withMutationRetry(() =>
    apiClient.post<Cart>('/cart/items', {
      productId: payload.productId,
      quantity: payload.quantity ?? 1,
    }),
  )
  return response.data
}

export async function updateCartItemQuantity(
  productId: string,
  payload: UpdateCartQuantityPayload,
): Promise<Cart> {
  const response = await withMutationRetry(() =>
    apiClient.patch<Cart>(`/cart/items/${productId}`, payload),
  )
  return response.data
}

export async function removeCartItem(productId: string): Promise<Cart> {
  const response = await withMutationRetry(() =>
    apiClient.delete<Cart>(`/cart/items/${productId}`),
  )
  return response.data
}

export async function clearCart(): Promise<Cart> {
  const response = await withMutationRetry(() => apiClient.delete<Cart>('/cart'))
  return response.data
}
