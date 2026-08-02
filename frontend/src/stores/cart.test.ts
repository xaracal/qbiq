import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as cartApi from '@/api/cart'
import { useCartStore } from '@/stores/cart'
import type { Cart, CartItem } from '@/types'

vi.mock('@/api/cart', () => ({
  fetchCart: vi.fn(),
  addCartItem: vi.fn(),
  updateCartItemQuantity: vi.fn(),
  removeCartItem: vi.fn(),
  clearCart: vi.fn(),
}))

const sampleItem: CartItem = {
  productId: 'prod-1',
  name: 'Sample Product',
  price: 19.99,
  quantity: 2,
  thumbnailUrl: 'https://example.com/img.png',
}

const sampleCart: Cart = {
  items: [sampleItem],
  total: 39.98,
}

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('computes itemCount from cart quantities', () => {
    const store = useCartStore()
    store.applyCart(sampleCart)

    expect(store.itemCount).toBe(2)
  })

  it('fetchCart loads cart state from the API', async () => {
    vi.mocked(cartApi.fetchCart).mockResolvedValue(sampleCart)
    const store = useCartStore()

    await store.fetchCart()

    expect(store.items).toEqual(sampleCart.items)
    expect(store.total).toBe(39.98)
    expect(store.error).toBeNull()
  })

  it('addItem updates cart from API response', async () => {
    vi.mocked(cartApi.addCartItem).mockResolvedValue(sampleCart)
    const store = useCartStore()

    await store.addItem('prod-1', 2)

    expect(cartApi.addCartItem).toHaveBeenCalledWith({ productId: 'prod-1', quantity: 2 })
    expect(store.itemCount).toBe(2)
    expect(store.total).toBe(39.98)
  })

  it('updateQuantity replaces cart state', async () => {
    const updatedCart: Cart = {
      items: [{ ...sampleItem, quantity: 3 }],
      total: 59.97,
    }
    vi.mocked(cartApi.updateCartItemQuantity).mockResolvedValue(updatedCart)
    const store = useCartStore()

    await store.updateQuantity('prod-1', 3)

    expect(cartApi.updateCartItemQuantity).toHaveBeenCalledWith('prod-1', { quantity: 3 })
    expect(store.itemCount).toBe(3)
    expect(store.total).toBe(59.97)
  })

  it('removeItem updates cart after deletion', async () => {
    vi.mocked(cartApi.removeCartItem).mockResolvedValue({ items: [], total: 0 })
    const store = useCartStore()
    store.applyCart(sampleCart)

    await store.removeItem('prod-1')

    expect(store.items).toEqual([])
    expect(store.total).toBe(0)
    expect(store.itemCount).toBe(0)
  })

  it('clearCart resets cart state', async () => {
    vi.mocked(cartApi.clearCart).mockResolvedValue({ items: [], total: 0 })
    const store = useCartStore()
    store.applyCart(sampleCart)

    await store.clearCart()

    expect(store.items).toEqual([])
    expect(store.total).toBe(0)
  })

  it('rolls back optimistic update when API call fails', async () => {
    vi.mocked(cartApi.updateCartItemQuantity).mockRejectedValue(new Error('Network error'))
    const store = useCartStore()
    store.applyCart(sampleCart)

    await expect(store.updateQuantity('prod-1', 5)).rejects.toThrow('Network error')

    expect(store.items).toEqual(sampleCart.items)
    expect(store.total).toBe(sampleCart.total)
    expect(store.error).toBe('Network error')
  })
})
