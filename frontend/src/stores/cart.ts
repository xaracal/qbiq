import { defineStore } from 'pinia'

import * as cartApi from '@/api/cart'
import { getErrorMessage } from '@/api/errors'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  total: number
  loading: boolean
  error: string | null
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
    applyCart(cart: { items: CartItem[]; total: number }) {
      this.items = cart.items
      this.total = cart.total
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

    async addItem(productId: string, quantity = 1) {
      this.loading = true
      this.error = null
      try {
        const cart = await cartApi.addCartItem({ productId, quantity })
        this.applyCart(cart)
      } catch (error) {
        this.error = getErrorMessage(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateQuantity(productId: string, quantity: number) {
      this.loading = true
      this.error = null
      try {
        const cart = await cartApi.updateCartItemQuantity(productId, { quantity })
        this.applyCart(cart)
      } catch (error) {
        this.error = getErrorMessage(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeItem(productId: string) {
      this.loading = true
      this.error = null
      try {
        const cart = await cartApi.removeCartItem(productId)
        this.applyCart(cart)
      } catch (error) {
        this.error = getErrorMessage(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async clearCart() {
      this.loading = true
      this.error = null
      try {
        const cart = await cartApi.clearCart()
        this.applyCart(cart)
      } catch (error) {
        this.error = getErrorMessage(error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
