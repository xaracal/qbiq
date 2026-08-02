<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ShoppingCartIcon } from '@lucide/vue'

import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const { itemCount } = storeToRefs(cartStore)
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
  >
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink to="/products" class="text-lg font-semibold tracking-tight text-primary">
        QBIQ Dig Store
      </RouterLink>
      <nav class="flex items-center gap-4 text-sm font-medium" aria-label="Main navigation">
        <RouterLink
          to="/products"
          class="text-muted-foreground transition-colors hover:text-foreground"
          active-class="!text-foreground"
        >
          Products
        </RouterLink>
        <RouterLink
          to="/cart"
          class="relative inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          active-class="!text-foreground"
          aria-label="Shopping cart"
        >
          <ShoppingCartIcon class="size-4" aria-hidden="true" />
          <span>Cart</span>
          <span
            v-if="itemCount > 0"
            class="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground"
            :aria-label="`${itemCount} items in cart`"
          >
            {{ itemCount }}
          </span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
