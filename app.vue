<script setup lang="ts">
import { PhWarning } from '@phosphor-icons/vue'
import { ClickScrollPlugin, OverlayScrollbars } from 'overlayscrollbars'
import { setBackground } from './native/app/App'
import { onAppResize } from './native/app/events'
import 'overlayscrollbars/overlayscrollbars.css'

const deviceStore = useDeviceStore()
const l = useLoggerStore()
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
    l.$log({
      type: 'info',
      location: 'App',
      message:
        'Running on native desktop app, special features will be avaliable :0',
    })
    deviceStore.nativeEnviroment = true
    setBackground(16, 18, 19)

    let prevResizeTimeout: NodeJS.Timeout | undefined
    let lastResize = 0
    root.style.transition = 'opacity 250ms ease'
    onAppResize(() => {
      l.$log({ location: 'App', message: 'Received backend resize event..' })

      const resizeTime = performance.now()
      if (resizeTime < lastResize + 20) {
        l.$log({
          location: 'App',
          message: 'A resize event just happened, ignoring this one...',
        })
        return
      }
      if (prevResizeTimeout) clearTimeout(prevResizeTimeout)
      l.$log({
        location: 'App',
        message: 'Setting window opacity to 0 during resize',
      })
      root.style.opacity = '0'

      lastResize = resizeTime
      prevResizeTimeout = setTimeout(() => {
        root.style.opacity = '1'
        l.$log({
          location: 'App',
          message: 'Window opacity reset back to 1 (normal)',
        })
      }, 150)
    })
  }
})

onUnmounted(() => {
  clearInterval(carouselRotate)
})

const hardReload = () => {
  window.location.href = '/authenticated/'
}

const reportError = (e: unknown) => {
  l.$log({ type: 'error', optionalParams: [e] })
}
deviceStore.testSetDeviceProfile()
</script>

<template>
  <div id="shadfin-ui">
    <NuxtLayout>
      <NuxtErrorBoundary @error="reportError">
        <NuxtPage />

        <template #error="{ error }">
          <div class="flex flex-col items-center justify-center absolute h-full">
            <Alert
              class="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
            >
              <PhWarning
                class="size-6"
                weight="fill"
              />
              <AlertTitle
                class="inline-flex gap-2 justify-center items-center ml-3"
              >
                An error occured when loading that page.
              </AlertTitle>

              <AlertDescription class="ml-3">
                {{ error }}
              </AlertDescription>
            </Alert>
            <div class="inline-flex justify-center mt-4 items-center w-full">
              <Button
                class="w-full"
                variant="outline"
                @click="hardReload"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </template>
      </NuxtErrorBoundary>
    </NuxtLayout>
    <!-- <LazyToastNotifications /> -->
  </div>
</template>

<style lang="scss">
.os-scrollbar-handle {
  @apply bg-primary/50 !w-[3px] hover:!w-2 hover:!bg-primary/85 transition-all duration-200 ease-in hidden md:block;
}

.os-scrollbar-vertical {
  right: 2px;
}
</style>
