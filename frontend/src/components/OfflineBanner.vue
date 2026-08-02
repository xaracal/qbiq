<script setup lang="ts">
import { WifiOffIcon } from '@lucide/vue'
import { storeToRefs } from 'pinia'

import { useNetworkStore } from '@/stores/network'

const networkStore = useNetworkStore()
const { isOffline } = storeToRefs(networkStore)
</script>

<template>
  <div
    v-if="isOffline"
    class="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-900 dark:text-amber-100"
    role="status"
    aria-live="polite"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-center gap-2">
      <WifiOffIcon class="size-4 shrink-0" aria-hidden="true" />
      <span>You appear to be offline. Some actions may fail until your connection is restored.</span>
    </div>
  </div>
</template>
