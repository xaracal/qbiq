import { apiClient, isNetworkError, withGetRetry } from '@/api/client'
import { ApiError } from '@/api/errors'
import { getDemoProduct, listDemoProducts } from '@/lib/demo-catalog'
import { useDemoStore } from '@/stores/demo'
import type { ProductDetail, ProductListQuery, ProductSummary } from '@/types'

async function fetchProductsLive(params: ProductListQuery): Promise<ProductSummary[]> {
  const response = await withGetRetry(() =>
    apiClient.get<ProductSummary[]>('/products', { params }),
  )
  return response.data
}

export async function fetchProducts(params: ProductListQuery = {}): Promise<ProductSummary[]> {
  const demoStore = useDemoStore()

  if (demoStore.isDemoMode) {
    return listDemoProducts(params)
  }

  try {
    const products = await fetchProductsLive(params)
    demoStore.disableDemoMode()
    return products
  } catch (error) {
    if (isNetworkError(error)) {
      demoStore.enableDemoMode()
      return listDemoProducts(params)
    }
    throw error
  }
}

async function fetchProductLive(id: string): Promise<ProductDetail> {
  const response = await withGetRetry(() => apiClient.get<ProductDetail>(`/products/${id}`))
  return response.data
}

export async function fetchProduct(id: string): Promise<ProductDetail> {
  const demoStore = useDemoStore()

  if (demoStore.isDemoMode) {
    const product = getDemoProduct(id)
    if (!product) {
      throw new ApiError(`Product not found: ${id}`, 404, 'NOT_FOUND')
    }
    return product
  }

  try {
    const product = await fetchProductLive(id)
    demoStore.disableDemoMode()
    return product
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NOT_FOUND') {
      throw error
    }
    if (isNetworkError(error)) {
      demoStore.enableDemoMode()
      const product = getDemoProduct(id)
      if (!product) {
        throw new ApiError(`Product not found: ${id}`, 404, 'NOT_FOUND')
      }
      return product
    }
    throw error
  }
}
