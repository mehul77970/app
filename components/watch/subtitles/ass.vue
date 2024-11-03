<script setup lang="ts">
import { getSubtitleStream } from '@/lib/player'
import ASS from '@/lib/subtitles/ass'

const serverStore = useServerStore()
const playerStore = usePlayerStore()

const assCaptionElement = ref(null as null | HTMLElement)

const assStreamRaw = await fetch(
  `${serverStore.url}${getSubtitleStream(playerStore.subtitle!, playerStore.item!.Id!)}`,
)
const assStreamText = await assStreamRaw.text()
const subtitleSyncOffset = computed(() => playerStore.subtitleTimeSyncOffset)

let assPlayer: undefined | ASS

onMounted(async () => {
  if (!assCaptionElement.value || !document) return

  const videoElement = document.getElementById('video') as HTMLVideoElement

  if (!videoElement) return

  assPlayer = new ASS(assStreamText, videoElement, {
    container: assCaptionElement.value,
    resampling: 'video_height',
  })

  playerStore.subtitleLoading = null
})

onUnmounted(() => {
  if (!assPlayer) return
  assPlayer.destroy()
  assPlayer = undefined
})

watch(subtitleSyncOffset, (seconds) => {
  if (!assPlayer) return

  assPlayer.delay = seconds
})
</script>

<template>
  <div
    ref="assCaptionElement"
    class="top-0 left-0"
  />
</template>
