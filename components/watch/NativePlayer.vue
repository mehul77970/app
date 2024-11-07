<script setup lang="ts">
import { setURL, start, setPlayerPause, setPlayerPosition } from '@/native/Player'
import { onPlayerLoaded, onPlayerLoading, onPlayerMessage, onPlayerPlaybackRestart, onPlayerPosition } from '~/native/events'

const playerStore = usePlayerStore()
const mediaBrowser = useMediaBrowserStore()

const item = computed(() => playerStore.item)
const paused = computed(() => playerStore.paused)
const seeking = computed(() => playerStore.seeking)

const root = document.documentElement

playerStore.settings.native.transparent = true

onMounted(async () => {
  if (!item.value) return

  root.setAttribute('transparent-player', 'true')
  const streamURL = mediaBrowser.generateDownloadURL(item.value)

  await setURL(streamURL)

  start()

  onPlayerLoaded((duration_sec) => {
    playerStore.loading = false
    playerStore.loaded = true
    playerStore.paused = false
    playerStore.duration = duration_sec * 1000
  })

  onPlayerLoading(() => {
    playerStore.loading = true
  })

  onPlayerMessage((message) => {
    console.log('Got message from player', message)
  })

  onPlayerPosition((position_sec) => {
    playerStore.position = {
      percent: (position_sec / (playerStore.duration / 1000)) * 100,
      value: position_sec,
    }
  })

  onPlayerPlaybackRestart(() => {
    playerStore.seeking.value = false
    playerStore.loading = false
  })
})

onUnmounted(() => {
  playerStore.settings.native.transparent = false

  root.setAttribute('transparent-player', 'false')

  console.log(root.attributes)
})

watch(paused, async () => {
  setPlayerPause(paused.value)
})

watch(seeking, async (seek, _) => {
  if (!seek.value) return

  console.log('Native player seeking to: ', seek.position)

  await setPlayerPosition(seek.position)
})
</script>

<style lang="scss">
@import url('~/assets/css/native.scss');
</style>
