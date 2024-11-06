<script setup lang="ts">
const deviceStore = useDeviceStore()

let carouselRotate: NodeJS.Timeout | undefined

onMounted(() => {
  const event = new Event('carousel-update')

  carouselRotate = setInterval(() => {
    window.dispatchEvent(event)
  }, 5000)

  // @ts-expect-error Check for wails
  if (window.runtime || window.wails) {
    console.log('Running on native desktop app, special features will be avaliable :0')
    deviceStore.nativeEnviroment = true
  }
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
