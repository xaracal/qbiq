<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowLeftIcon } from '@lucide/vue'
import { toast } from 'vue-sonner'

import EmptyState from '@/components/EmptyState.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import SkeletonProductDetail from '@/components/SkeletonProductDetail.vue'
import StarRating from '@/components/StarRating.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchProduct } from '@/api/products'
import { ApiError, getErrorMessage } from '@/api/errors'
import { formatDate, formatPrice } from '@/lib/format'
import { useCartStore } from '@/stores/cart'
import type { ProductDetail } from '@/types'

const route = useRoute()
const cartStore = useCartStore()

const product = ref<ProductDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const notFound = ref(false)
const addingToCart = ref(false)

const productId = computed(() => String(route.params.id))

async function loadProduct() {
  loading.value = true
  error.value = null
  notFound.value = false
  product.value = null

  try {
    product.value = await fetchProduct(productId.value)
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

async function handleAddToCart() {
  if (!product.value) {
    return
  }

  addingToCart.value = true
  try {
    await cartStore.addItem(product.value.id)
    toast.success('Added to cart', {
      description: `${product.value.name} was added to your cart.`,
    })
  } catch (err) {
    toast.error('Could not add to cart', {
      description: getErrorMessage(err),
    })
  } finally {
    addingToCart.value = false
  }
}

watch(productId, loadProduct, { immediate: true })
</script>

<template>
  <section>
    <SkeletonProductDetail v-if="loading" />

    <EmptyState
      v-else-if="notFound"
      title="Product not found"
      description="This product may have been removed or the link is incorrect."
      action-label="Back to products"
      action-to="/products"
    />

    <div v-else-if="error" class="space-y-4">
      <ErrorBanner :message="error" @retry="loadProduct" />
      <Button as-child variant="outline" class="h-10">
        <RouterLink to="/products" class="inline-flex items-center gap-2">
          <ArrowLeftIcon class="size-4" />
          Back to products
        </RouterLink>
      </Button>
    </div>

    <article v-else-if="product" class="space-y-6">
      <Button as-child variant="ghost" class="h-10 px-0 text-muted-foreground hover:text-foreground">
        <RouterLink to="/products" class="inline-flex items-center gap-2">
          <ArrowLeftIcon class="size-4" />
          Back to products
        </RouterLink>
      </Button>

      <div class="grid gap-8 lg:grid-cols-2">
        <div class="overflow-hidden rounded-xl border border-border bg-muted">
          <img
            :src="product.thumbnailUrl"
            :alt="product.name"
            class="aspect-video w-full object-cover"
          />
        </div>

        <div class="space-y-6">
          <div class="space-y-3">
            <p class="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {{ product.category }}
            </p>
            <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">{{ product.name }}</h1>
            <p class="text-2xl font-semibold text-primary">{{ formatPrice(product.price) }}</p>
            <p class="text-muted-foreground">{{ product.shortDescription }}</p>
            <p class="leading-relaxed">{{ product.longDescription }}</p>
          </div>

          <Button
            class="h-10 min-w-36"
            :disabled="addingToCart || cartStore.loading"
            @click="handleAddToCart"
          >
            {{ addingToCart ? 'Adding...' : 'Add to cart' }}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer reviews</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <p v-if="product.reviews.length === 0" class="text-sm text-muted-foreground">
            No reviews yet. Be the first to share your experience.
          </p>
          <div
            v-for="(review, index) in product.reviews"
            :key="`${review.author}-${index}`"
            class="space-y-2 border-b border-border pb-6 last:border-b-0 last:pb-0"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="font-medium">{{ review.author }}</p>
              <p class="text-sm text-muted-foreground">{{ formatDate(review.date) }}</p>
            </div>
            <StarRating :rating="review.rating" />
            <p class="text-sm leading-relaxed text-muted-foreground">{{ review.comment }}</p>
          </div>
        </CardContent>
      </Card>
    </article>
  </section>
</template>
