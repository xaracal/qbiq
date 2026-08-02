<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Card from 'primevue/card'

import { formatPrice } from '@/lib/format'
import type { ProductSummary } from '@/types'

const props = defineProps<{
  product: ProductSummary
}>()

const linkLabel = computed(
  () => `View details for ${props.product.name}, ${formatPrice(props.product.price)}`,
)
</script>

<template>
  <RouterLink
    :to="`/products/${product.id}`"
    :aria-label="linkLabel"
    class="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <Card class="h-full overflow-hidden transition-shadow hover:shadow-md">
      <template #content>
        <div class="aspect-video overflow-hidden bg-muted">
          <img
            :src="product.thumbnailUrl"
            alt=""
            class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div class="space-y-2 px-4 pt-4">
          <h2 class="line-clamp-2 text-base font-semibold leading-snug">
            {{ product.name }}
          </h2>
          <p class="line-clamp-2 text-sm text-muted-foreground">
            {{ product.shortDescription }}
          </p>
          <p class="pb-2 text-lg font-semibold text-primary">{{ formatPrice(product.price) }}</p>
        </div>
      </template>
    </Card>
  </RouterLink>
</template>
