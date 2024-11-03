<script setup lang="ts">
import { CaptionsRenderer, parseResponse } from 'media-captions'
import { getSubtitleStream } from '@/lib/player'

const vttCaptionElement = ref(null as null | HTMLElement)

const playerStore = usePlayerStore()
const serverStore = useServerStore()

const vttSubsRaw = await fetch(
  `${serverStore.url}${getSubtitleStream(playerStore.subtitle!, playerStore.item!.Id!)}`,
)
const vttSubsData = await parseResponse(vttSubsRaw)

let vttPlayer: undefined | CaptionsRenderer

onMounted(async () => {
  if (!vttCaptionElement.value) return

  vttPlayer = new CaptionsRenderer(vttCaptionElement.value!)

  vttPlayer.changeTrack(vttSubsData)

  playerStore.subtitleSyncCallback = (time: number) => {
    if (!vttPlayer) return

    vttPlayer.currentTime = time
  }

  playerStore.subtitleLoading = null
})

onUnmounted(() => {
  if (!vttPlayer) return

  vttPlayer.destroy()

  vttPlayer = undefined
})
</script>

<template>
  <div
    ref="vttCaptionElement"
    class="mb-24 overflow-y-hidden text-xl inline-flex flex-col gap-2"
  />
</template>

<style>
div[part="cue-display"] {
  background-color: rgb(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  padding: 1.5rem;
  border-radius: 0.25rem;
  opacity: 0.25;
  animation: vtt-caption-fade-in 100ms ease forwards;
  width: fit-content;
  text-align: center;
  font-size: var(--vtt-font-size);
}

@keyframes vtt-caption-fade-in {
  0% {
    opacity: 0.25;
  }

  100% {
    opacity: 1;
  }
}
</style>
