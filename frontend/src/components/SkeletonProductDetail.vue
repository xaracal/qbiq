<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <Skeleton class="aspect-video w-full rounded-xl" />
    <div class="space-y-6">
      <div class="space-y-3">
        <Skeleton class="h-8 w-2/3" />
        <Skeleton class="h-6 w-24" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-4/5" />
      </div>
      <Skeleton class="h-10 w-36" />
      <Card>
        <CardHeader>
          <Skeleton class="h-6 w-32" />
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-for="index in 2" :key="index" class="space-y-2">
            <Skeleton class="h-4 w-1/3" />
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
