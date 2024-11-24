<script setup lang="ts">
import { getSubtitleStream } from '@/lib/player'
import ASS from '@/lib/subtitles/ass'

const serverStore = useServerStore()
const playerStore = usePlayerStore()
const deviceStore = useDeviceStore()

const assStreamRaw = await fetch(
  `${serverStore.url}${getSubtitleStream(playerStore.subtitle!, playerStore.item!.Id!)}`,
)
const assStreamText = await assStreamRaw.text()
const subtitleSyncOffset = computed(() => playerStore.subtitleTimeSyncOffset)

let assPlayer: undefined | ASS

onMounted(async () => {
  if (!document) return

  const videoElement = (document.getElementById(
    'video',
  ) as HTMLVideoElement) || { currentTime: 0 }

  if (playerStore.settings.native.enabled && deviceStore.nativeEnviroment) {
    playerStore.subtitleSyncCallback = (time: number) => {
      videoElement.currentTime = time
    }
  }

  if (!videoElement) return

  assPlayer = new ASS(assStreamText, videoElement, {
    container: document.getElementById('ass-container') || undefined,
    resampling: 'video_height',
    native: playerStore.settings.native.enabled,
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
