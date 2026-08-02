import { apiClient } from '@/api/client'
import type { AddToCartPayload, Cart, UpdateCartQuantityPayload } from '@/types'

export async function fetchCart(): Promise<Cart> {
  const response = await apiClient.get<Cart>('/api/cart')
  return response.data
}

export async function addCartItem(payload: AddToCartPayload): Promise<Cart> {
  const response = await apiClient.post<Cart>('/api/cart/items', {
    productId: payload.productId,
    quantity: payload.quantity ?? 1,
  })
  return response.data
}

export async function updateCartItemQuantity(
  productId: string,
  payload: UpdateCartQuantityPayload,
): Promise<Cart> {
  const response = await apiClient.patch<Cart>(`/api/cart/items/${productId}`, payload)
  return response.data
}

export async function removeCartItem(productId: string): Promise<Cart> {
  const response = await apiClient.delete<Cart>(`/api/cart/items/${productId}`)
  return response.data
}

export async function clearCart(): Promise<Cart> {
  const response = await apiClient.delete<Cart>('/api/cart')
  return response.data
}
