<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'

import EmptyState from '@/components/EmptyState.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import { getErrorMessage } from '@/api/errors'
import { toast } from '@/lib/toast'
import { formatPrice } from '@/lib/format'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const router = useRouter()
const { items, total, loading, error } = storeToRefs(cartStore)

const checkoutLoading = ref(false)
const updatingProductId = ref<string | null>(null)

async function loadCart() {
  try {
    await cartStore.fetchCart()
  } catch {
    // Error state is stored on the cart store.
  }
}

async function updateQuantity(productId: string, quantity: number) {
  updatingProductId.value = productId
  try {
    await cartStore.updateQuantity(productId, quantity)
  } catch (err) {
    toast.error('Could not update quantity', {
      description: getErrorMessage(err),
    })
  } finally {
    updatingProductId.value = null
  }
}

async function removeItem(productId: string) {
  updatingProductId.value = productId
  try {
    await cartStore.removeItem(productId)
    toast.success('Item removed from cart')
  } catch (err) {
    toast.error('Could not remove item', {
      description: getErrorMessage(err),
    })
  } finally {
    updatingProductId.value = null
  }
}

async function handleCheckout() {
  checkoutLoading.value = true
  try {
    const order = await cartStore.checkout()
    await router.push({ name: 'checkout-success', params: { orderId: order.id } })
  } catch (err) {
    toast.error('Checkout failed', {
      description: getErrorMessage(err),
    })
  } finally {
    checkoutLoading.value = false
  }
}

onMounted(() => {
  void loadCart()
})
</script>

<template>
  <section class="space-y-6" aria-labelledby="cart-heading">
    <div class="space-y-2">
      <h1 id="cart-heading" class="text-2xl font-semibold tracking-tight sm:text-3xl">
        Shopping cart
      </h1>
      <p class="text-sm text-muted-foreground">Review your items before checkout.</p>
    </div>

    <ErrorBanner v-if="error" :message="error" @retry="loadCart" />

    <div
      v-if="loading && items.length === 0"
      class="space-y-4"
      aria-busy="true"
      aria-label="Loading cart"
    >
      <Card v-for="index in 3" :key="index">
        <template #content>
          <div class="flex gap-4 p-2 sm:p-4">
            <Skeleton width="5rem" height="5rem" border-radius="0.375rem" />
            <div class="flex flex-1 flex-col gap-3">
              <Skeleton width="50%" height="1.25rem" />
              <Skeleton width="6rem" height="1rem" />
              <Skeleton width="8rem" height="2rem" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <EmptyState
      v-else-if="!loading && items.length === 0 && !error"
      :icon="ShoppingBagIcon"
      title="Your cart is empty"
      description="Browse our catalog and add something you like."
      action-label="Browse products"
      action-to="/products"
    />

    <div v-else class="space-y-6">
      <ul class="list-none space-y-4 p-0" role="list" aria-label="Cart items">
        <li v-for="item in items" :key="item.productId">
          <Card>
            <template #content>
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  :src="item.thumbnailUrl"
                  :alt="`${item.name} thumbnail`"
                  class="size-20 shrink-0 rounded-md object-cover"
                />
                <div class="min-w-0 flex-1 space-y-1">
                  <h2 class="truncate font-medium">{{ item.name }}</h2>
                  <p class="text-sm text-primary">{{ formatPrice(item.price) }}</p>
                  <p class="text-sm text-muted-foreground">
                    Subtotal: {{ formatPrice(item.price * item.quantity) }}
                  </p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <div
                    class="flex items-center rounded-lg border border-border"
                    role="group"
                    :aria-label="`Quantity for ${item.name}`"
                  >
                    <Button
                      text
                      rounded
                      class="rounded-none"
                      :aria-label="`Decrease quantity of ${item.name}`"
                      :disabled="updatingProductId === item.productId || loading"
                      @click="updateQuantity(item.productId, item.quantity - 1)"
                    >
                      <MinusIcon class="size-4" aria-hidden="true" />
                    </Button>
                    <span
                      class="min-w-10 text-center text-sm font-medium"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {{ item.quantity }}
                    </span>
                    <Button
                      text
                      rounded
                      class="rounded-none"
                      :aria-label="`Increase quantity of ${item.name}`"
                      :disabled="updatingProductId === item.productId || loading"
                      @click="updateQuantity(item.productId, item.quantity + 1)"
                    >
                      <PlusIcon class="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                  <Button
                    severity="secondary"
                    outlined
                    rounded
                    :aria-label="`Remove ${item.name} from cart`"
                    :disabled="updatingProductId === item.productId || loading"
                    @click="removeItem(item.productId)"
                  >
                    <Trash2Icon class="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </template>
          </Card>
        </li>
      </ul>

      <Card>
        <template #content>
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div aria-live="polite" aria-atomic="true">
              <p class="text-sm text-muted-foreground">Order total</p>
              <p class="text-lg font-semibold">{{ formatPrice(total) }}</p>
            </div>
            <Button
              :label="checkoutLoading ? 'Processing...' : 'Checkout'"
              :loading="checkoutLoading"
              :disabled="loading || items.length === 0"
              :aria-label="checkoutLoading ? 'Processing checkout' : 'Proceed to checkout'"
              class="min-w-40"
              @click="handleCheckout"
            />
          </div>
        </template>
      </Card>
    </div>
  </section>
</template>
