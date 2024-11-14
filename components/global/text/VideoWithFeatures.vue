<script setup lang="ts">
const { video, featureOnly = false } = defineProps<{
  video: VideoSource;
  featureOnly?: boolean;
}>();
</script>

<template>
  <span class="inline-flex items-center justify-center">
    <template v-if="!featureOnly">
      {{ video.title }}
    </template>
    <IconDolbyVision v-if="video.dolbyDigital" class="ml-2 h-4 mt-1" />
    <span
      v-if="video.hdr"
      class="ml-2 px-[4px] bg-foreground text-background rounded-sm"
      >HDR 10</span
    >
  </span>
</template>
