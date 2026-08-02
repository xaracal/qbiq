import { apiClient } from '@/api/client'
import type { Order } from '@/types'

export async function checkout(): Promise<Order> {
  const response = await apiClient.post<Order>('/checkout')
  return response.data
}

export async function fetchOrder(orderId: string): Promise<Order> {
  const response = await apiClient.get<Order>(`/orders/${orderId}`)
  return response.data
}
