<script setup lang="ts">
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'

defineProps<{
  title: string
  description: string
  icon?: Component
  actionLabel?: string
  actionTo?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-16 text-center">
    <component :is="icon" v-if="icon" class="size-12 text-muted-foreground" aria-hidden="true" />
    <div class="space-y-2">
      <h2 class="text-xl font-semibold tracking-tight">{{ title }}</h2>
      <p class="max-w-md text-sm text-muted-foreground">{{ description }}</p>
    </div>
    <RouterLink v-if="actionLabel && actionTo" :to="actionTo">
      <Button :label="actionLabel" />
    </RouterLink>
  </div>
</template>
