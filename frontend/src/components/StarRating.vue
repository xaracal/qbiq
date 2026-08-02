<script setup lang="ts">
import { computed } from 'vue'
import { StarIcon } from '@lucide/vue'

const props = defineProps<{
  rating: number
  max?: number
}>()

const maxRating = computed(() => props.max ?? 5)
</script>

<template>
  <div class="flex items-center gap-0.5" :aria-label="`${rating} out of ${maxRating} stars`">
    <StarIcon
      v-for="index in maxRating"
      :key="index"
      class="size-4"
      :class="index <= rating ? 'fill-primary text-primary' : 'text-muted-foreground/40'"
      aria-hidden="true"
    />
  </div>
</template>
