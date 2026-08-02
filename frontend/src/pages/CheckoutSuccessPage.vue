<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { CheckCircle2Icon } from '@lucide/vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'

import EmptyState from '@/components/EmptyState.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import { fetchOrder } from '@/api/checkout'
import { ApiError, getErrorMessage } from '@/api/errors'
import { formatDate, formatPrice } from '@/lib/format'
import type { Order } from '@/types'

const route = useRoute()

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const notFound = ref(false)

const orderId = computed(() => String(route.params.orderId))

async function loadOrder() {
  loading.value = true
  error.value = null
  notFound.value = false
  order.value = null

  try {
    order.value = await fetchOrder(orderId.value)
  } catch (err) {
    if (err instanceof ApiError && err.code === 'NOT_FOUND') {
      notFound.value = true
    } else {
      error.value = getErrorMessage(err)
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadOrder()
})
</script>

<template>
  <section class="space-y-6">
    <div v-if="loading" class="space-y-4">
      <Skeleton width="16rem" height="2rem" />
      <Skeleton width="24rem" height="1rem" />
      <Card v-for="index in 2" :key="index">
        <template #content>
          <div class="flex gap-4">
            <Skeleton width="5rem" height="5rem" border-radius="0.375rem" />
            <div class="flex flex-1 flex-col gap-3">
              <Skeleton width="50%" height="1.25rem" />
              <Skeleton width="6rem" height="1rem" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <EmptyState
      v-else-if="notFound"
      title="Order not found"
      description="We could not find this order. It may have expired or belongs to another session."
      action-label="Browse products"
      action-to="/products"
    />

    <template v-else-if="order">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-primary">
          <CheckCircle2Icon class="size-6" />
          <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Order confirmed</h1>
        </div>
        <p class="text-sm text-muted-foreground">
          Thank you for your order. This is a mock checkout — no payment was processed.
        </p>
      </div>

      <ErrorBanner v-if="error" :message="error" @retry="loadOrder" />

      <Card>
        <template #content>
          <div class="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <p class="text-muted-foreground">Order ID</p>
              <p class="font-mono text-xs sm:text-sm">{{ order.id }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Date</p>
              <p>{{ formatDate(order.createdAt) }}</p>
            </div>
          </div>
        </template>
      </Card>

      <ul class="space-y-4">
        <li v-for="item in order.items" :key="item.productId">
          <Card>
            <template #content>
              <div class="flex gap-4">
                <img
                  :src="item.thumbnailUrl"
                  :alt="item.name"
                  class="size-20 shrink-0 rounded-md object-cover"
                />
                <div class="min-w-0 flex-1 space-y-1">
                  <h2 class="truncate font-medium">{{ item.name }}</h2>
                  <p class="text-sm text-muted-foreground">Qty: {{ item.quantity }}</p>
                  <p class="text-sm text-primary">{{ formatPrice(item.price * item.quantity) }}</p>
                </div>
              </div>
            </template>
          </Card>
        </li>
      </ul>

      <Card>
        <template #content>
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Order total</p>
              <p class="text-lg font-semibold">{{ formatPrice(order.total) }}</p>
            </div>
            <RouterLink to="/products">
              <Button label="Continue shopping" class="min-w-40" />
            </RouterLink>
          </div>
        </template>
      </Card>
    </template>

    <ErrorBanner v-else-if="error" :message="error" @retry="loadOrder" />
  </section>
</template>
