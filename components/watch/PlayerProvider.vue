<script setup lang="ts">
import {
  getAudioStreams,
  getPlayerType,
  getSubtitleStreams,
  type PlayerType,
} from '@/lib/player'

const { id, startPosition, audioIndex, subtitleIndex } = defineProps<{
  id: string
  audioIndex?: string
  subtitleIndex?: string
  startPosition?: number
}>()

const playbackStore = usePlaybackStore()
const playerStore = usePlayerStore()

const startAt
  = startPosition
  || (await playerStore.getPlayerItem(id)).UserData?.PlaybackPositionTicks
  || 0

const playerType = ref(null as PlayerType | null)

const info = await playbackStore.getPlaybackInfo(id, {
  audioIndex: Number(audioIndex),
  subtitleIndex: Number(subtitleIndex),
})

playbackStore.setPlaybackInfo(info)

playerType.value = getPlayerType(info)

await playerStore.getPlayerItem(id)

playerStore.getDefaultMediaStreams(info)

onMounted(async () => {
  if (audioIndex) {
    const audio = getAudioStreams(info).find(
      a => a.source?.Index === Number(audioIndex),
    )

    if (!audio) return

    playerStore.audio = audio
  }

  if (subtitleIndex) {
    const subtitle = getSubtitleStreams(info).find(
      s => s.source?.Index === Number(subtitleIndex),
    )

    if (!subtitle) return

    playerStore.subtitle = subtitle
  }
})

onUnmounted(() => {
  playerStore.subtitle = null
  playerStore.audio = null
  playerStore.video = null

  playbackStore.info = null
  playbackStore._transcodingUrl = null
})

const debug = computed(() => playerStore.debug.enabled)
</script>

<template>
  <div
    class="relative w-full"
  >
    <!-- HLS Player -->
    <LazyWatchHLSPlayer
      v-if="playerType === 'hls'"
      :id
      :video-index="0"
      :audio-index="Number(audioIndex)"
      :subtitle-index="Number(subtitleIndex)"
      :start-position="startAt"
      class=""
    />
  </div>

  <div
    class="absolute w-full h-full max-w-full inline-flex flex-col justify-center items-center select-none overflow-hidden"
  >
    <div v-if="!playerType">
      <h1>No compatiable player found.</h1>
    </div>

    <!-- Debug window -->
    <WatchDebug v-if="debug" />

    <!-- HTTP player -->
    <LazyWatchHTTPPlayer
      v-if="playerType === 'http'"
      :id
      :start-position="startAt"
    />

    <!-- Native player, only avaliable for desktop! -->
    <LazyWatchNativePlayer
      v-if="playerType === 'native'"
      :start-position="startAt"
    />

    <!-- Player controls -->
    <WatchControlsProvider :id />
  </div>
</template>
