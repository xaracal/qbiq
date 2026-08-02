import { apiClient, withGetRetry } from '@/api/client'
import type { ProductDetail, ProductListQuery, ProductSummary } from '@/types'

export async function fetchProducts(params: ProductListQuery = {}): Promise<ProductSummary[]> {
  const response = await withGetRetry(() =>
    apiClient.get<ProductSummary[]>('/products', { params }),
  )
  return response.data
}

export async function fetchProduct(id: string): Promise<ProductDetail> {
  const response = await withGetRetry(() => apiClient.get<ProductDetail>(`/products/${id}`))
  return response.data
}
