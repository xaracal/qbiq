<script setup lang="ts">
import { MonitorIcon, WifiIcon, WifiOffIcon } from '@lucide/vue'
import { storeToRefs } from 'pinia'

import { useDemoStore } from '@/stores/demo'
import { useNetworkStore } from '@/stores/network'

const networkStore = useNetworkStore()
const demoStore = useDemoStore()
const { isOffline, showReconnected } = storeToRefs(networkStore)
const { isDemoMode, reason } = storeToRefs(demoStore)

const readmeUrl = 'https://github.com/xaracal/qbiq#quick-start-docker-compose'
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

  <div
    v-else-if="isDemoMode"
    class="border-b border-sky-500/30 bg-sky-500/10 px-4 py-2 text-center text-sm text-sky-950 dark:text-sky-100"
    role="status"
    aria-live="polite"
  >
    <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1">
      <MonitorIcon class="size-4 shrink-0" aria-hidden="true" />
      <span>
        <strong>Demo mode</strong> — {{ reason ?? 'Backend unavailable' }}. Showing sample products
        with a local cart.
      </span>
      <a
        :href="readmeUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium underline underline-offset-2"
      >
        Run full stack locally
      </a>
    </div>
  </div>

  <div
    v-else-if="showReconnected"
    class="border-b border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center text-sm text-emerald-900 dark:text-emerald-100"
    role="status"
    aria-live="polite"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-center gap-2">
      <WifiIcon class="size-4 shrink-0" aria-hidden="true" />
      <span>Connection restored. Refreshing data…</span>
    </div>
  </div>
</template>
