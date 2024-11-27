<script setup lang="ts">
import ASS from 'assjs'
import { getSubtitleStream } from '@/lib/player'

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

  const videoElement = document.getElementById('video') as HTMLVideoElement

  if (playerStore.settings.native.enabled && deviceStore.nativeEnvironment) {
    playerStore.subtitleSyncCallback = (time: number) => {
      videoElement.currentTime = time
    }
  }

  if (!videoElement) return

  assPlayer = new ASS(assStreamText, videoElement, {
    container: document.getElementById('ass-container') || undefined,
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
