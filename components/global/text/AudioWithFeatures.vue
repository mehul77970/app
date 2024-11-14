<script setup lang="ts">
const { audio, featureOnly = false } = defineProps<{
  audio: AudioSource;
  featureOnly?: boolean;
}>();
</script>

<template>
  <span class="inline-flex items-center justify-center">
    <template v-if="!featureOnly">
      {{ audio.title }}
    </template>
    <IconDolbyDigital v-if="audio.dolbyAudio" class="ml-2 h-4 mt-1" />
    <IconDTS v-if="audio.dtsAudio" class="ml-2 h-3" />
  </span>
</template>
