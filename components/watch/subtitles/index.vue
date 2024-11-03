<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue'
import { notify } from 'notiwind'

const playerStore = usePlayerStore()

const subtitle = computed(() => playerStore.subtitle)
const subtitleLoadInfo = computed(() => playerStore.subtitleLoading)
const loaded = computed(() => playerStore.loaded)
const elementLoad = ref(false)

onMounted(() => {
  elementLoad.value = true
})

onErrorCaptured((err) => {
  notify(
    {
      title: 'Subtitle Load Failed',
      type: 'error',
      text: `${err.message}`,
      group: 'bottom',
    },
    5000,
  )
  playerStore.subtitleLoading = null
})

watch(subtitle, (newSub) => {
  if (!newSub?.source) return

  playerStore.subtitleLoading = `Fetching ${newSub?.title} Subtitle Data..`
})
</script>

<template>
  <div
    v-if="subtitle && loaded && elementLoad"
    class="absolute w-full inline-flex flex-col items-center justify-end h-full pointer-events-none"
  >
    <Transition name="fade-short-slide">
      <div
        v-if="subtitleLoadInfo"
        class="inline-flex gap-2 items-center justify-center z-[999999] absolute right-5 top-4"
      >
        <PhCircleNotch
          :size="32"
          class="animate-spin"
        />
        {{ subtitleLoadInfo }}
      </div>
    </Transition>

    <template v-if="subtitle.source">
      <!-- WebVTT -->
      <LazyWatchSubtitlesVtt
        v-if="subtitle.source.Codec?.includes('vtt')"
        :key="subtitle.source.Index"
      />

      <!-- ASS -->
      <LazyWatchSubtitlesAss
        v-if="subtitle.source.Codec?.includes('ass')"
        :key="subtitle.source.Index"
      />

      <!-- PGSub -->
      <LazyWatchSubtitlesPgs
        v-if="subtitle.source.Codec?.includes('pgs')"
        :key="subtitle.source.Index"
      />

      <!-- SRT (Which can just be converted to webvtt) -->
      <LazyWatchSubtitlesVtt
        v-if="subtitle.source.Codec?.includes('subrip')"
        :key="subtitle.source.Index"
      />
    </template>
  </div>
</template>
