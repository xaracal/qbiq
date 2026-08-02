export interface ProductReview {
  author: string
  rating: number
  comment: string
  date: string
}

export interface ProductSummary {
  id: string
  name: string
  price: number
  shortDescription: string
  thumbnailUrl: string
}

export interface ProductDetail extends ProductSummary {
  longDescription: string
  category: string
  reviews: ProductReview[]
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  thumbnailUrl: string
}

export interface Cart {
  items: CartItem[]
  total: number
}

export interface ProductListQuery {
  name?: string
  category?: string
  sort_by?: 'price' | 'name'
  sort_order?: 'asc' | 'desc'
}

export interface AddToCartPayload {
  productId: string
  quantity?: number
}

export interface UpdateCartQuantityPayload {
  quantity: number
}
