import { defineStore } from 'pinia'

import * as cartApi from '@/api/cart'
import * as checkoutApi from '@/api/checkout'
import { getErrorMessage } from '@/api/errors'
import type { CartItem, Order } from '@/types'

interface CartState {
  items: CartItem[]
  total: number
  loading: boolean
  error: string | null
}

interface CartSnapshot {
  items: CartItem[]
  total: number
}

function computeTotal(items: CartItem[]): number {
  return Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100
}

function cloneItems(items: CartItem[]): CartItem[] {
  return items.map((item) => ({ ...item }))
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    total: 0,
    loading: false,
    error: null,
  }),

  getters: {
    itemCount(state): number {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },
  },

  actions: {
    snapshot(): CartSnapshot {
      return {
        items: cloneItems(this.items),
        total: this.total,
      }
    },

    applyCart(cart: { items: CartItem[]; total: number }) {
      this.items = cart.items
      this.total = cart.total
    },

    restoreSnapshot(snapshot: CartSnapshot) {
      this.items = snapshot.items
      this.total = snapshot.total
    },

    applyOptimisticAdd(
      productId: string,
      quantity: number,
      itemDetails?: Omit<CartItem, 'quantity'>,
    ) {
      if (!itemDetails) {
        return
      }

      const items = cloneItems(this.items)
      const existing = items.find((item) => item.productId === productId)
      if (existing) {
        existing.quantity += quantity
      } else {
        items.push({ ...itemDetails, productId, quantity })
      }
      this.items = items
      this.total = computeTotal(items)
    },

    applyOptimisticQuantity(productId: string, quantity: number) {
      const items = cloneItems(this.items)
      const index = items.findIndex((item) => item.productId === productId)
      if (index === -1) {
        return
      }
      if (quantity <= 0) {
        items.splice(index, 1)
      } else {
        items[index] = { ...items[index], quantity }
      }
      this.items = items
      this.total = computeTotal(items)
    },

    applyOptimisticRemove(productId: string) {
      const items = cloneItems(this.items).filter((item) => item.productId !== productId)
      this.items = items
      this.total = computeTotal(items)
    },

    async fetchCart() {
      this.loading = true
      this.error = null
      try {
        const cart = await cartApi.fetchCart()
        this.applyCart(cart)
      } catch (error) {
        this.error = getErrorMessage(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async addItem(
      productId: string,
      quantity = 1,
      itemDetails?: Omit<CartItem, 'quantity'>,
    ) {
      const previous = this.snapshot()
      this.applyOptimisticAdd(productId, quantity, itemDetails)
      this.error = null

      try {
        const cart = await cartApi.addCartItem({ productId, quantity })
        this.applyCart(cart)
      } catch (error) {
        this.restoreSnapshot(previous)
        this.error = getErrorMessage(error)
        throw error
      }
    },

    async updateQuantity(productId: string, quantity: number) {
      const previous = this.snapshot()
      this.applyOptimisticQuantity(productId, quantity)
      this.error = null

      try {
        const cart = await cartApi.updateCartItemQuantity(productId, { quantity })
        this.applyCart(cart)
      } catch (error) {
        this.restoreSnapshot(previous)
        this.error = getErrorMessage(error)
        throw error
      }
    },

    async removeItem(productId: string) {
      const previous = this.snapshot()
      this.applyOptimisticRemove(productId)
      this.error = null

      try {
        const cart = await cartApi.removeCartItem(productId)
        this.applyCart(cart)
      } catch (error) {
        this.restoreSnapshot(previous)
        this.error = getErrorMessage(error)
        throw error
      }
    },

    async clearCart() {
      const previous = this.snapshot()
      this.applyCart({ items: [], total: 0 })
      this.error = null

      try {
        const cart = await cartApi.clearCart()
        this.applyCart(cart)
      } catch (error) {
        this.restoreSnapshot(previous)
        this.error = getErrorMessage(error)
        throw error
      }
    },

    async checkout(): Promise<Order> {
      this.error = null

      try {
        return await checkoutApi.checkout()
      } catch (error) {
        this.error = getErrorMessage(error)
        throw error
      }
    },
  },
})
