<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { PackageOpenIcon } from '@lucide/vue'

import EmptyState from '@/components/EmptyState.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductFilters from '@/components/ProductFilters.vue'
import SkeletonProductGrid from '@/components/SkeletonProductGrid.vue'
import { fetchProducts } from '@/api/products'
import { getErrorMessage } from '@/api/errors'
import type { ProductListQuery, ProductSummary } from '@/types'

const products = ref<ProductSummary[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const query = ref<ProductListQuery>({})

const resultsStatus = computed(() => {
  if (loading.value) {
    return 'Loading products.'
  }
  if (error.value) {
    return 'Product list failed to load.'
  }
  if (products.value.length === 0) {
    return 'No products match your filters.'
  }
  const count = products.value.length
  return `${count} product${count === 1 ? '' : 's'} found.`
})

async function loadProducts(params: ProductListQuery = query.value) {
  query.value = params
  loading.value = true
  error.value = null
  try {
    products.value = await fetchProducts(params)
  } catch (err) {
    error.value = getErrorMessage(err)
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadProducts()
})
</script>

<template>
  <section class="space-y-6" aria-labelledby="products-heading">
    <div class="space-y-2">
      <h1 id="products-heading" class="text-2xl font-semibold tracking-tight sm:text-3xl">
        Products
      </h1>
      <p class="text-sm text-muted-foreground">
        Browse our digital catalog of ebooks, software, and courses.
      </p>
    </div>

    <ProductFilters @change="loadProducts" />

    <p class="sr-only" aria-live="polite" aria-atomic="true">{{ resultsStatus }}</p>

    <ErrorBanner v-if="error" :message="error" @retry="loadProducts(query)" />

    <div v-if="loading" aria-busy="true" aria-label="Loading products">
      <SkeletonProductGrid />
    </div>

    <EmptyState
      v-else-if="!error && products.length === 0"
      :icon="PackageOpenIcon"
      title="No products found"
      description="Try adjusting your search or filters to find what you are looking for."
      action-label="Clear filters"
      action-to="/products"
    />

    <ul
      v-else-if="!loading && products.length > 0"
      class="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
      role="list"
    >
      <li v-for="product in products" :key="product.id">
        <ProductCard :product="product" />
      </li>
    </ul>
  </section>
</template>
