import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  addDemoCartItem,
  clearDemoCartStorage,
  getDemoCart,
  removeDemoCartItem,
  updateDemoCartItemQuantity,
} from '@/lib/demo-cart'

function createStorage() {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => store.clear(),
  }
}

describe('demo-cart', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorage())
    vi.stubGlobal('sessionStorage', createStorage())
    clearDemoCartStorage()
  })

  it('adds items and computes total', () => {
    const cart = addDemoCartItem({ productId: 'ebook-python-mastery', quantity: 2 })
    expect(cart.items).toHaveLength(1)
    expect(cart.total).toBe(59.98)
  })

  it('updates quantity and removes at zero', () => {
    addDemoCartItem({ productId: 'ebook-python-mastery', quantity: 1 })
    updateDemoCartItemQuantity('ebook-python-mastery', { quantity: 3 })
    const updated = getDemoCart()
    expect(updated.items[0]?.quantity).toBe(3)

    removeDemoCartItem('ebook-python-mastery')
    expect(getDemoCart().items).toHaveLength(0)
  })
})
