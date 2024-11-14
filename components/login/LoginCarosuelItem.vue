<script setup lang="ts">
const { src = "" } = defineProps<{
  src?: string;
}>();
</script>

<template>
  <img :src="src" class="w-full h-full absolute fade-gradient" />
</template>

<style scoped>
.fade-gradient {
  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  object-fit: cover;
}
</style>
