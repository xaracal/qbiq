<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/format'
import type { ProductSummary } from '@/types'

defineProps<{
  product: ProductSummary
}>()
</script>

<template>
  <RouterLink
    :to="`/products/${product.id}`"
    class="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <Card class="h-full overflow-hidden transition-shadow hover:shadow-md">
      <div class="aspect-video overflow-hidden bg-muted">
        <img
          :src="product.thumbnailUrl"
          :alt="product.name"
          class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <CardHeader class="gap-1 px-4 pb-2">
        <CardTitle class="line-clamp-2 text-base font-semibold leading-snug">
          {{ product.name }}
        </CardTitle>
      </CardHeader>
      <CardContent class="px-4 pb-2">
        <p class="line-clamp-2 text-sm text-muted-foreground">
          {{ product.shortDescription }}
        </p>
      </CardContent>
      <CardFooter class="px-4 pb-4">
        <p class="text-lg font-semibold text-primary">{{ formatPrice(product.price) }}</p>
      </CardFooter>
    </Card>
  </RouterLink>
</template>
