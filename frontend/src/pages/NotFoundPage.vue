<template>
  <div class="flex flex-col items-center justify-center gap-4 py-16 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">Page not found</h1>
    <p class="max-w-md text-muted-foreground">
      The page you are looking for does not exist.
    </p>
    <RouterLink
      to="/products"
      class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
    >
      Back to products
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
