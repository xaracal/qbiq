<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { storeToRefs } from 'pinia'

import EmptyState from '@/components/EmptyState.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/api/errors'
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
  <section class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Shopping cart</h1>
      <p class="text-sm text-muted-foreground">Review your items before checkout.</p>
    </div>

    <ErrorBanner v-if="error" :message="error" @retry="loadCart" />

    <div v-if="loading && items.length === 0" class="space-y-4">
      <Card v-for="index in 3" :key="index">
        <CardContent class="flex gap-4 p-4 sm:p-6">
          <Skeleton class="size-20 shrink-0 rounded-md" />
          <div class="flex flex-1 flex-col gap-3">
            <Skeleton class="h-5 w-1/2" />
            <Skeleton class="h-4 w-24" />
            <Skeleton class="h-8 w-32" />
          </div>
        </CardContent>
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
      <ul class="space-y-4">
        <li v-for="item in items" :key="item.productId">
          <Card>
            <CardContent class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
              <img
                :src="item.thumbnailUrl"
                :alt="item.name"
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
                <div class="flex items-center rounded-lg border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-10 rounded-none"
                    :aria-label="`Decrease quantity of ${item.name}`"
                    :disabled="updatingProductId === item.productId || loading"
                    @click="updateQuantity(item.productId, item.quantity - 1)"
                  >
                    <MinusIcon class="size-4" />
                  </Button>
                  <span class="min-w-10 text-center text-sm font-medium">{{ item.quantity }}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-10 rounded-none"
                    :aria-label="`Increase quantity of ${item.name}`"
                    :disabled="updatingProductId === item.productId || loading"
                    @click="updateQuantity(item.productId, item.quantity + 1)"
                  >
                    <PlusIcon class="size-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  class="size-10"
                  :aria-label="`Remove ${item.name} from cart`"
                  :disabled="updatingProductId === item.productId || loading"
                  @click="removeItem(item.productId)"
                >
                  <Trash2Icon class="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </li>
      </ul>

      <Card>
        <CardContent class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p class="text-sm text-muted-foreground">Order total</p>
            <p class="text-lg font-semibold">{{ formatPrice(total) }}</p>
          </div>
          <Button
            class="h-10 min-w-40"
            :disabled="checkoutLoading || loading || items.length === 0"
            @click="handleCheckout"
          >
            {{ checkoutLoading ? 'Processing...' : 'Checkout' }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
