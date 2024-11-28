<script setup lang="ts">
import Presence from '@/components/ui/motion/Presence.vue'
</script>

<template>
  <div
    class="flex flex-col w-full min-h-full justify-start items-center gap-12"
  >
    <Presence>
      <NuxtPage />
    </Presence>
  </div>
</template>
