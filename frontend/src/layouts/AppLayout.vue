<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const { itemCount } = storeToRefs(cartStore)
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header
      class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <RouterLink to="/products" class="text-lg font-semibold tracking-tight text-primary">
          QBIQ
        </RouterLink>
        <nav class="flex items-center gap-4 text-sm font-medium">
          <RouterLink
            to="/products"
            class="text-muted-foreground transition-colors hover:text-foreground"
            active-class="text-foreground"
          >
            Products
          </RouterLink>
          <RouterLink
            to="/cart"
            class="relative text-muted-foreground transition-colors hover:text-foreground"
            active-class="text-foreground"
          >
            Cart
            <span
              v-if="itemCount > 0"
              class="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground"
            >
              {{ itemCount }}
            </span>
          </RouterLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>
