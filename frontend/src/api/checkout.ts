import { apiClient } from '@/api/client'
import type { Order } from '@/types'

export async function checkout(): Promise<Order> {
  const response = await apiClient.post<Order>('/api/checkout')
  return response.data
}

export async function fetchOrder(orderId: string): Promise<Order> {
  const response = await apiClient.get<Order>(`/api/orders/${orderId}`)
  return response.data
}
