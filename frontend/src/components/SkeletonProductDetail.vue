<script setup lang="ts">
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <Skeleton width="100%" height="16rem" border-radius="0.75rem" />
    <div class="space-y-6">
      <div class="space-y-3">
        <Skeleton width="66%" height="2rem" />
        <Skeleton width="6rem" height="1.5rem" />
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="80%" height="1rem" />
      </div>
      <Skeleton width="9rem" height="2.5rem" />
      <Card>
        <template #title>
          <Skeleton width="8rem" height="1.5rem" />
        </template>
        <template #content>
          <div class="space-y-4">
            <div v-for="index in 2" :key="index" class="space-y-2">
              <Skeleton width="33%" height="1rem" />
              <Skeleton width="100%" height="1rem" />
              <Skeleton width="83%" height="1rem" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
