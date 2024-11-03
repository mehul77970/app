<script setup lang="ts">
const { video } = defineProps<{ video: VideoSource }>()
</script>

<template>
  <span class="inline-flex items-center justify-center">
    {{ video.title }}

    <IconDolbyVision
      v-if="video.dolbyDigital"
      class="ml-2 h-4 mt-1"
    />
    <span
      v-if="video.hdr"
      class="ml-2 px-[4px] bg-foreground text-background rounded-sm"
    >HDR 10</span>
  </span>
</template>
