<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

import AppHeader from '@/components/AppHeader.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

onMounted(() => {
  void cartStore.fetchCart().catch(() => {
    // Badge stays empty when backend is unavailable during development.
  })
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <AppHeader />
    <main class="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>
