<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-16 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">Page not found</h1>
    <p class="max-w-md text-muted-foreground">
      The page you are looking for does not exist.
    </p>
    <Button as-child class="h-10">
      <RouterLink to="/products">Back to products</RouterLink>
    </Button>
  </div>
</template>
