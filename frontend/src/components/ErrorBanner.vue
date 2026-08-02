<script setup lang="ts">
import { AlertCircleIcon } from '@lucide/vue'

import { Button } from '@/components/ui/button'

defineProps<{
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    class="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
    role="alert"
  >
    <div class="flex items-start gap-3">
      <AlertCircleIcon class="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
      <p class="text-sm text-foreground">{{ message }}</p>
    </div>
    <Button variant="outline" class="h-10 shrink-0" @click="emit('retry')">
      Try again
    </Button>
  </div>
</template>
