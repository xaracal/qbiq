import { apiClient, isNetworkError, withGetRetry, withMutationRetry } from '@/api/client'
import {
  addDemoCartItem,
  clearDemoCart,
  getDemoCart,
  removeDemoCartItem,
  updateDemoCartItemQuantity,
} from '@/lib/demo-cart'
import { useDemoStore } from '@/stores/demo'
import type { AddToCartPayload, Cart, UpdateCartQuantityPayload } from '@/types'

function withDemoFallback<T>(operation: () => Promise<T>, demoOperation: () => T): Promise<T> {
  const demoStore = useDemoStore()
  if (demoStore.isDemoMode) {
    return Promise.resolve(demoOperation())
  }

  return operation().catch((error) => {
    if (isNetworkError(error)) {
      demoStore.enableDemoMode()
      return demoOperation()
    }
    throw error
  })
}

export async function fetchCart(): Promise<Cart> {
  return withDemoFallback(
    async () => {
      const response = await withGetRetry(() => apiClient.get<Cart>('/cart'))
      useDemoStore().disableDemoMode()
      return response.data
    },
    () => getDemoCart(),
  )
}

export async function addCartItem(payload: AddToCartPayload): Promise<Cart> {
  return withDemoFallback(
    async () => {
      const response = await withMutationRetry(() =>
        apiClient.post<Cart>('/cart/items', {
          productId: payload.productId,
          quantity: payload.quantity ?? 1,
        }),
      )
      useDemoStore().disableDemoMode()
      return response.data
    },
    () => addDemoCartItem(payload),
  )
}

export async function updateCartItemQuantity(
  productId: string,
  payload: UpdateCartQuantityPayload,
): Promise<Cart> {
  return withDemoFallback(
    async () => {
      const response = await withMutationRetry(() =>
        apiClient.patch<Cart>(`/cart/items/${productId}`, payload),
      )
      useDemoStore().disableDemoMode()
      return response.data
    },
    () => updateDemoCartItemQuantity(productId, payload),
  )
}

export async function removeCartItem(productId: string): Promise<Cart> {
  return withDemoFallback(
    async () => {
      const response = await withMutationRetry(() =>
        apiClient.delete<Cart>(`/cart/items/${productId}`),
      )
      useDemoStore().disableDemoMode()
      return response.data
    },
    () => removeDemoCartItem(productId),
  )
}

export async function clearCart(): Promise<Cart> {
  return withDemoFallback(
    async () => {
      const response = await withMutationRetry(() => apiClient.delete<Cart>('/cart'))
      useDemoStore().disableDemoMode()
      return response.data
    },
    () => clearDemoCart(),
  )
}
