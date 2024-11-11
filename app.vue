<script setup lang="ts">
import 'overlayscrollbars/overlayscrollbars.css'
import {
  OverlayScrollbars,
  ClickScrollPlugin,
} from 'overlayscrollbars'
import { setBackground } from './native/app/App'
import { onAppResize } from './native/app/events'

const deviceStore = useDeviceStore()

let carouselRotate: NodeJS.Timeout | undefined
onMounted(() => {
  // optional: use the ClickScrollPlugin to make the option "scrollbars.clickScroll: true" available
  OverlayScrollbars.plugin(ClickScrollPlugin)

  OverlayScrollbars(document.body, {
    scrollbars: {
      clickScroll: true,
    },
  })

  const event = new Event('carousel-update')

  carouselRotate = setInterval(() => {
    window.dispatchEvent(event)
  }, 5000)

  if (window.runtime || window.wails) {
    const root = document.documentElement
    console.log('Running on native desktop app, special features will be avaliable :0')
    deviceStore.nativeEnviroment = true
    setBackground(16, 18, 19)

    let prevResizeTimeout: NodeJS.Timeout | undefined
    let lastResize = 0
    root.style.transition = 'opacity 250ms ease'
    onAppResize(() => {
      console.log('Resized backend resize event...')
      const resizeTime = performance.now()
      if (resizeTime < lastResize + 20) {
        console.log('Last resize event just happened! Ignoring this one...')
        return
      }
      if (prevResizeTimeout) clearTimeout(prevResizeTimeout)
      console.log('Setting window opacity to 0 during resize')
      root.style.opacity = '0'

      lastResize = resizeTime
      prevResizeTimeout = setTimeout(() => {
        root.style.opacity = '1'
        console.log('Window opacity has been reset to 1')
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
  <div id="shadfin-ui">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <LazyToastNotifications />
  </div>
</template>

<style lang="scss">
.os-scrollbar-handle {
  @apply bg-primary/50 !w-[3px] hover:!w-2 hover:!bg-primary/85 transition-all duration-200 ease-in;
}

.os-scrollbar-vertical {
  right: 2px;
}
</style>
