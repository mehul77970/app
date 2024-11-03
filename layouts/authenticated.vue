<script setup lang="ts">
import GlobalNavigation from '@/components/global/Navigation.vue'
</script>

<template>
  <div
    id="authenticated-layout"
    class="min-h-full max-w-full dark:bg-background font-onest flex flex-1 justify-center items-start"
  >
    <GlobalNavigation />

    <slot />
  </div>
</template>
