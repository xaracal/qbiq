import { apiClient, withGetRetry, withMutationRetry } from '@/api/client'
import type { Order } from '@/types'

export async function checkout(): Promise<Order> {
  const response = await withMutationRetry(() => apiClient.post<Order>('/checkout'))
  return response.data
}

export async function fetchOrder(orderId: string): Promise<Order> {
  const response = await withGetRetry(() => apiClient.get<Order>(`/orders/${orderId}`))
  return response.data
}
