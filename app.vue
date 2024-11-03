<script setup lang="ts">
const deviceStore = useDeviceStore()

let carouselRotate: NodeJS.Timeout | undefined

onMounted(() => {
  const event = new Event('carousel-update')

  carouselRotate = setInterval(() => {
    window.dispatchEvent(event)
  }, 5000)
})

onUnmounted(() => {
  clearInterval(carouselRotate)
})

deviceStore.testSetDeviceProfile()
</script>

<template>
  <div class="shadfin-ui">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
