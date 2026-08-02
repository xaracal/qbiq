<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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
      <Skeleton class="aspect-video w-full rounded-none" />
      <CardHeader class="gap-2 px-4 pb-2">
        <Skeleton class="h-5 w-3/4" />
      </CardHeader>
      <CardContent class="space-y-2 px-4 pb-2">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-5/6" />
      </CardContent>
      <CardFooter class="px-4 pb-4">
        <Skeleton class="h-6 w-20" />
      </CardFooter>
    </Card>
  </div>
</template>
