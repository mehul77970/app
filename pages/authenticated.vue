<script setup lang="ts">
definePageMeta({ middleware: "authenticated", layout: "authenticated" });

const deviceStore = useDeviceStore();

onMounted(() => {
  window.requestIdleCallback(() => {
    deviceStore.bitrateTest();
  });
});
</script>

<template>
  <NuxtPage />
</template>
