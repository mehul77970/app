<script lang="ts" setup>
import { PhArrowArcLeft } from '@phosphor-icons/vue'
import { Button } from '~/components/ui/button'

import { truncate } from '~/lib/utils'

const playerStore = usePlayerStore()
const router = useRouter()

const info = computed(() => playerStore.item)
const showControls = ref(false)
const paused = computed(() => playerStore.paused)

let controlsHideTimer = null as null | NodeJS.Timeout

const controlsMouseMove = () => {
  if (controlsHideTimer) {
    clearTimeout(controlsHideTimer)
  }
  controlsHideTimer = null

  showControls.value = true
  document.body!.style.cursor = 'default'

  controlsHideTimer = setTimeout(() => {
    console.log('First timeout should run')
    hideMouseControls()
  }, 3000)
}

const hideMouseControls = () => {
  if (!playerStore.hideControls || paused.value) {
    if (controlsHideTimer) {
      clearTimeout(controlsHideTimer)
    }

    controlsHideTimer = setTimeout(hideMouseControls, 3000)
    return
  }

  document.body!.style.cursor = 'none'
  showControls.value = false
}

const togglePause = () => {
  playerStore.paused = !playerStore.paused

  if (!playerStore.paused) {
    playerStore.hideControls = true
  }
}

onBeforeUnmount(() => {
  document.body!.style.cursor = 'default'

  if (controlsHideTimer) {
    clearTimeout(controlsHideTimer)
  }
})

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <LazyWatchSubtitles v-if="info" />
  <WatchControlsPlayerPause
    v-if="info"
    :info="info"
  />
  <div
    id="controls-detection-area"
    class="min-h-full mt-auto justify-start w-full inline-flex z-[50]"
    @mousemove="controlsMouseMove"
    @click="togglePause"
  >
    <Transition name="fade-short-slide">
      <div
        v-show="showControls || paused"
        class="w-full h-full flex relative"
      >
        <Button
          v-focus
          class="m-4 absolute selectable"
          variant="ghost"
          size="icon"
          @click="goBack"
        >
          <PhArrowArcLeft
            :size="24"
            weight="bold"
          />
        </Button>

        <WatchControlsDebug />
        <div
          class="inline-flex flex-col justify-end w-full mt-auto gap-2 p-6 overflow-hidden fade-bg"
        >
          <div
            v-if="info && info.SeriesName && info.SeasonName"
            id="season-series"
            class="inline-flex gap-2 w-full justify-start items-center flex-wrap"
          >
            <h2 class="lg:text-2xl font-semibold">
              {{ info.SeriesName }}
            </h2>

            <h2 class="text-white/75">
              {{ info.SeasonName }}
            </h2>
          </div>

          <div
            id="controls-container"
            class="inline-flex gap-2 items-center justify-between w-full"
          >
            <div class="inline-flex flex-col">
              <h1
                v-if="info"
                class="lg:text-2xl font-semibold text-white"
              >
                {{ info.Name }}
              </h1>
              <p
                v-if="info?.Overview"
                class="text-gray-400 max-w-full"
              >
                {{
                  truncate(info?.Overview!!, { length: 120, position: "end" })
                }}
              </p>
            </div>

            <div
              id="top-controls"
              class="inline-flex justify-end"
              @click.stop
            >
              <WatchControlsVolume />
              <WatchControlsSettings
                v-if="info"
                :item="info"
              />
              <WatchControlsPictureInPicture />
              <WatchControlsFullscreen />
            </div>
          </div>

          <WatchControlsTimeline
            v-if="info"
            :info="info"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-bg {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}
</style>
