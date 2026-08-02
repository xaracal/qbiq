<script setup lang="ts">
import { ref, watch } from 'vue'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div class="sm:col-span-2 lg:col-span-2">
      <label for="product-search" class="mb-2 block text-sm font-medium text-muted-foreground">
        Search
      </label>
      <Input
        id="product-search"
        v-model="name"
        type="search"
        placeholder="Search by product name..."
        class="h-10"
      />
    </div>

    <div>
      <label for="product-category" class="mb-2 block text-sm font-medium text-muted-foreground">
        Category
      </label>
      <Select v-model="category">
        <SelectTrigger id="product-category" class="h-10 w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="option in categories" :key="option.value" :value="option.value">
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <label for="product-sort" class="mb-2 block text-sm font-medium text-muted-foreground">
        Sort by
      </label>
      <Select v-model="sort">
        <SelectTrigger id="product-sort" class="h-10 w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
