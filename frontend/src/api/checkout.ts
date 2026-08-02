import { apiClient, isNetworkError, withGetRetry, withMutationRetry } from '@/api/client'
import { ApiError } from '@/api/errors'
import { checkoutDemoCart, getDemoOrder } from '@/lib/demo-cart'
import { useDemoStore } from '@/stores/demo'
import type { Order } from '@/types'

export async function checkout(): Promise<Order> {
  const demoStore = useDemoStore()

  if (demoStore.isDemoMode) {
    return checkoutDemoCart()
  }

  try {
    const response = await withMutationRetry(() => apiClient.post<Order>('/checkout'))
    demoStore.disableDemoMode()
    return response.data
  } catch (error) {
    if (isNetworkError(error)) {
      demoStore.enableDemoMode()
      return checkoutDemoCart()
    }
    throw error
  }
}

export async function fetchOrder(orderId: string): Promise<Order> {
  const demoStore = useDemoStore()

  if (demoStore.isDemoMode) {
    const order = getDemoOrder(orderId)
    if (!order) {
      throw new ApiError(`Order not found: ${orderId}`, 404, 'NOT_FOUND')
    }
    return order
  }

  try {
    const response = await withGetRetry(() => apiClient.get<Order>(`/orders/${orderId}`))
    demoStore.disableDemoMode()
    return response.data
  } catch (error) {
    if (isNetworkError(error)) {
      demoStore.enableDemoMode()
      const order = getDemoOrder(orderId)
      if (!order) {
        throw new ApiError(`Order not found: ${orderId}`, 404, 'NOT_FOUND')
      }
      return order
    }
    throw error
  }
}
