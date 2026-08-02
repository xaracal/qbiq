<script setup lang="ts">
import { ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

import type { ProductListQuery } from '@/types'

const emit = defineEmits<{
  change: [params: ProductListQuery]
}>()

const name = ref('')
const category = ref('all')
const sort = ref('name-asc')

const categories = [
  { value: 'all', label: 'All categories' },
  { value: 'ebook', label: 'Ebooks' },
  { value: 'software', label: 'Software' },
  { value: 'course', label: 'Courses' },
]

const sortOptions = [
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

function buildQuery(): ProductListQuery {
  const [sortBy, sortOrder] = sort.value.split('-') as ['price' | 'name', 'asc' | 'desc']
  return {
    name: name.value.trim() || undefined,
    category: category.value === 'all' ? undefined : category.value,
    sort_by: sortBy,
    sort_order: sortOrder,
  }
}

function emitChange() {
  emit('change', buildQuery())
}

let debounceTimer: ReturnType<typeof setTimeout> | undefined

watch(name, () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(emitChange, 300)
})

watch([category, sort], emitChange)
</script>

<template>
  <form
    role="search"
    aria-label="Filter and sort products"
    class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    @submit.prevent
  >
    <div class="sm:col-span-2 lg:col-span-2">
      <label for="product-search" class="mb-2 block text-sm font-medium text-muted-foreground">
        Search
      </label>
      <InputText
        id="product-search"
        v-model="name"
        type="search"
        placeholder="Search by product name..."
        aria-label="Search products by name"
        autocomplete="off"
        class="w-full"
      />
    </div>

    <div>
      <label for="product-category" class="mb-2 block text-sm font-medium text-muted-foreground">
        Category
      </label>
      <Select
        v-model="category"
        input-id="product-category"
        aria-labelledby="product-category"
        :options="categories"
        option-label="label"
        option-value="value"
        placeholder="Category"
        class="w-full"
      />
    </div>

    <div>
      <label for="product-sort" class="mb-2 block text-sm font-medium text-muted-foreground">
        Sort by
      </label>
      <Select
        v-model="sort"
        input-id="product-sort"
        aria-labelledby="product-sort"
        :options="sortOptions"
        option-label="label"
        option-value="value"
        placeholder="Sort by"
        class="w-full"
      />
    </div>
  </form>
</template>
