<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowLeftIcon } from '@lucide/vue'
import Button from 'primevue/button'
import Card from 'primevue/card'

import EmptyState from '@/components/EmptyState.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import SkeletonProductDetail from '@/components/SkeletonProductDetail.vue'
import StarRating from '@/components/StarRating.vue'
import { fetchProduct } from '@/api/products'
import { ApiError, getErrorMessage } from '@/api/errors'
import { toast } from '@/lib/toast'
import { formatDate, formatPrice } from '@/lib/format'
import { setPageTitle } from '@/lib/page-title'
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
    await cartStore.addItem(product.value.id, 1, {
      productId: product.value.id,
      name: product.value.name,
      price: product.value.price,
      thumbnailUrl: product.value.thumbnailUrl,
    })
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

watch(product, (value) => {
  if (value) {
    setPageTitle(value.name)
  }
})
</script>

<template>
  <section aria-labelledby="product-detail-heading">
    <div v-if="loading" aria-busy="true" aria-label="Loading product details">
      <SkeletonProductDetail />
    </div>

    <EmptyState
      v-else-if="notFound"
      title="Product not found"
      description="This product may have been removed or the link is incorrect."
      action-label="Back to products"
      action-to="/products"
    />

    <div v-else-if="error" class="space-y-4">
      <ErrorBanner :message="error" @retry="loadProduct" />
      <RouterLink to="/products">
        <Button severity="secondary" outlined>
          <ArrowLeftIcon class="mr-2 size-4" />
          Back to products
        </Button>
      </RouterLink>
    </div>

    <article v-else-if="product" class="space-y-6">
      <RouterLink to="/products" class="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Button text severity="secondary" class="px-0 text-muted-foreground">
          <ArrowLeftIcon class="mr-2 size-4" aria-hidden="true" />
          Back to products
        </Button>
      </RouterLink>

      <div class="grid gap-8 lg:grid-cols-2">
        <div class="overflow-hidden rounded-xl border border-border bg-muted">
          <img
            :src="product.thumbnailUrl"
            :alt="`${product.name} product image`"
            class="aspect-video w-full object-cover"
          />
        </div>

        <div class="space-y-6">
          <div class="space-y-3">
            <p class="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {{ product.category }}
            </p>
            <h1 id="product-detail-heading" class="text-2xl font-semibold tracking-tight sm:text-3xl">
              {{ product.name }}
            </h1>
            <p class="text-2xl font-semibold text-primary">{{ formatPrice(product.price) }}</p>
            <p class="text-muted-foreground">{{ product.shortDescription }}</p>
            <p class="leading-relaxed">{{ product.longDescription }}</p>
          </div>

          <Button
            :label="addingToCart ? 'Adding...' : 'Add to cart'"
            :loading="addingToCart"
            :disabled="cartStore.loading"
            :aria-label="addingToCart ? 'Adding product to cart' : `Add ${product.name} to cart`"
            class="min-w-36"
            @click="handleAddToCart"
          />
        </div>
      </div>

      <section aria-labelledby="reviews-heading">
        <Card>
          <template #title>
            <span id="reviews-heading">Customer reviews</span>
          </template>
          <template #content>
            <p v-if="product.reviews.length === 0" class="text-sm text-muted-foreground">
              No reviews yet. Be the first to share your experience.
            </p>
            <ul v-else class="list-none space-y-0 p-0" role="list">
              <li
                v-for="(review, index) in product.reviews"
                :key="`${review.author}-${index}`"
                class="space-y-2 border-b border-border pb-6 last:border-b-0 last:pb-0"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <p class="font-medium">{{ review.author }}</p>
                  <time class="text-sm text-muted-foreground" :datetime="review.date">
                    {{ formatDate(review.date) }}
                  </time>
                </div>
                <StarRating :rating="review.rating" />
                <p class="text-sm leading-relaxed text-muted-foreground">{{ review.comment }}</p>
              </li>
            </ul>
          </template>
        </Card>
      </section>
    </article>
  </section>
</template>
