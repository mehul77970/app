<script setup lang="ts">
const { audio } = defineProps<{ audio: AudioSource }>();
</script>

<template>
  <span class="inline-flex items-center justify-center">
    {{ audio.title }}

    <IconDolbyDigital v-if="audio.dolbyAudio" class="ml-2 h-4 mt-1" />
    <IconDTS v-if="audio.dtsAudio" class="ml-2 h-3" />
  </span>
</template>
