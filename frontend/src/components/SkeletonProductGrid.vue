<script setup lang="ts">
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'

withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 8,
  },
)
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
    <Card v-for="index in count" :key="index" class="overflow-hidden">
      <template #content>
        <Skeleton width="100%" height="10rem" class="rounded-none" />
        <div class="space-y-2 px-4 pt-4">
          <Skeleton width="75%" height="1.25rem" />
          <Skeleton width="100%" height="1rem" />
          <Skeleton width="83%" height="1rem" />
          <Skeleton width="5rem" height="1.5rem" class="mt-2" />
        </div>
      </template>
    </Card>
  </div>
</template>
