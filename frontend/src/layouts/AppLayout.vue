<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

import AppHeader from '@/components/AppHeader.vue'
import OfflineBanner from '@/components/OfflineBanner.vue'
import { useCartStore } from '@/stores/cart'
import { useNetworkStore } from '@/stores/network'

const cartStore = useCartStore()
const networkStore = useNetworkStore()

onMounted(() => {
  networkStore.initListeners()
  void cartStore.fetchCart().catch(() => {
    // Badge stays empty when backend is unavailable during development.
  })
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <OfflineBanner />
    <AppHeader />
    <main
      id="main-content"
      tabindex="-1"
      class="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
    >
      <RouterView />
    </main>
  </div>
</template>
