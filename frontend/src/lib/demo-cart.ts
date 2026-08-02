import { getDemoProduct } from '@/lib/demo-catalog'
import type { AddToCartPayload, Cart, CartItem, Order, UpdateCartQuantityPayload } from '@/types'

const CART_KEY = 'qbiq-demo-cart'

function computeTotal(items: CartItem[]): number {
  return Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100
}

function readItems(): CartItem[] {
  if (typeof localStorage === 'undefined') {
    return []
  }

  const raw = localStorage.getItem(CART_KEY)
  if (!raw) {
    return []
  }

  try {
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

function writeItems(items: CartItem[]): Cart {
  const cart: Cart = { items, total: computeTotal(items) }
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  return cart
}

export function getDemoCart(): Cart {
  const items = readItems()
  return { items, total: computeTotal(items) }
}

export function addDemoCartItem(payload: AddToCartPayload): Cart {
  const product = getDemoProduct(payload.productId)
  if (!product) {
    throw new Error(`Product not found: ${payload.productId}`)
  }

  const quantity = payload.quantity ?? 1
  const items = readItems()
  const existing = items.find((item) => item.productId === payload.productId)

  if (existing) {
    existing.quantity += quantity
  } else {
    items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      thumbnailUrl: product.thumbnailUrl,
    })
  }

  return writeItems(items)
}

export function updateDemoCartItemQuantity(
  productId: string,
  payload: UpdateCartQuantityPayload,
): Cart {
  const items = readItems()
  const index = items.findIndex((item) => item.productId === productId)
  if (index === -1) {
    throw new Error(`Cart item not found: ${productId}`)
  }

  if (payload.quantity <= 0) {
    items.splice(index, 1)
  } else {
    items[index] = { ...items[index], quantity: payload.quantity }
  }

  return writeItems(items)
}

export function removeDemoCartItem(productId: string): Cart {
  return writeItems(readItems().filter((item) => item.productId !== productId))
}

export function clearDemoCart(): Cart {
  return writeItems([])
}

export function checkoutDemoCart(): Order {
  const cart = getDemoCart()
  if (cart.items.length === 0) {
    throw new Error('Cart is empty')
  }

  const order: Order = {
    id: crypto.randomUUID(),
    sessionId: 'demo-session',
    items: cart.items,
    total: cart.total,
    status: 'completed',
    createdAt: new Date().toISOString(),
  }

  writeItems([])
  saveDemoOrder(order)
  return order
}

const ORDER_KEY = 'qbiq-demo-last-order'

export function saveDemoOrder(order: Order): void {
  sessionStorage.setItem(ORDER_KEY, JSON.stringify(order))
}

export function getDemoOrder(orderId: string): Order | null {
  const raw = sessionStorage.getItem(ORDER_KEY)
  if (!raw) {
    return null
  }

  try {
    const order = JSON.parse(raw) as Order
    return order.id === orderId ? order : null
  } catch {
    return null
  }
}

export function clearDemoCartStorage(): void {
  localStorage.removeItem(CART_KEY)
}
