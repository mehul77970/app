<script setup lang="ts">
import { setBackground } from './native/app/App'
import { onAppResize } from './native/app/events'

const deviceStore = useDeviceStore()

let carouselRotate: NodeJS.Timeout | undefined

onMounted(() => {
  const event = new Event('carousel-update')

  carouselRotate = setInterval(() => {
    window.dispatchEvent(event)
  }, 5000)

  // @ts-expect-error Check for wails
  if (window.runtime || window.wails) {
    const root = document.documentElement
    console.log('Running on native desktop app, special features will be avaliable :0')
    deviceStore.nativeEnviroment = true
    setBackground(16, 18, 19)

    let prevResizeTimeout: NodeJS.Timeout | undefined
    let lastResize = 0
    root.style.transition = 'opacity 250ms ease'
    onAppResize(() => {
      const resizeTime = performance.now()
      if (resizeTime < lastResize + 20) return
      if (prevResizeTimeout) clearTimeout(prevResizeTimeout)
      root.style.opacity = '0'

      lastResize = resizeTime
      prevResizeTimeout = setTimeout(() => {
        root.style.opacity = '100'
      }, 150)
    })
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
