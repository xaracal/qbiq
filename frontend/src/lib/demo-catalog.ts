import rawProducts from '@/data/products.json'
import type { ProductDetail, ProductListQuery, ProductSummary } from '@/types'

const catalog = rawProducts as ProductDetail[]

function toSummary(product: ProductDetail): ProductSummary {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    shortDescription: product.shortDescription,
    thumbnailUrl: product.thumbnailUrl,
  }
}

function matchesName(product: ProductDetail, name?: string): boolean {
  if (!name) {
    return true
  }
  return product.name.toLowerCase().includes(name.toLowerCase())
}

function matchesCategory(product: ProductDetail, category?: string): boolean {
  if (!category) {
    return true
  }
  return product.category === category
}

function sortProducts(products: ProductDetail[], params: ProductListQuery): ProductDetail[] {
  const sortField = params.sort_by ?? 'name'
  const direction = params.sort_order === 'desc' ? -1 : 1

  return [...products].sort((left, right) => {
    const leftValue = left[sortField]
    const rightValue = right[sortField]
    if (typeof leftValue === 'string' && typeof rightValue === 'string') {
      return leftValue.localeCompare(rightValue) * direction
    }
    return ((leftValue as number) - (rightValue as number)) * direction
  })
}

export function listDemoProducts(params: ProductListQuery = {}): ProductSummary[] {
  const filtered = catalog.filter(
    (product) => matchesName(product, params.name) && matchesCategory(product, params.category),
  )
  return sortProducts(filtered, params).map(toSummary)
}

export function getDemoProduct(productId: string): ProductDetail | null {
  return catalog.find((product) => product.id === productId) ?? null
}

export function getAllDemoProducts(): ProductDetail[] {
  return catalog
}
