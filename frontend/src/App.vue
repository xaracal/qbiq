<script setup lang="ts">
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

import AppLayout from '@/layouts/AppLayout.vue'
import { registerToastHandlers } from '@/lib/toast'

const primeToast = useToast()

registerToastHandlers({
  success(summary, options) {
    primeToast.add({
      severity: 'success',
      summary,
      detail: options?.description,
      life: 4000,
    })
  },
  error(summary, options) {
    primeToast.add({
      severity: 'error',
      summary,
      detail: options?.description,
      life: 5000,
    })
  },
})
</script>

<template>
  <AppLayout />
  <Toast position="top-right" />
</template>
