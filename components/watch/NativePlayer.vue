<script setup lang="ts">
import { setURL, start, togglePause } from '@/native/Player'
import { onPlayerLoaded, onPlayerMessage } from '~/native/events'

const playerStore = usePlayerStore()
const mediaBrowser = useMediaBrowserStore()

const item = computed(() => playerStore.item)
const paused = computed(() => playerStore.paused)

const root = document.documentElement

playerStore.settings.native.transparent = true

onMounted(async () => {
  if (!item.value) return

  root.setAttribute('transparent-player', 'true')
  const streamURL = mediaBrowser.generateDownloadURL(item.value)

  await setURL(streamURL)

  start()

  onPlayerLoaded(() => {
    playerStore.loading = false
    playerStore.loaded = true
    playerStore.paused = false
  })

  onPlayerMessage((message) => {
    console.log('Got message from player', message)
  })
})

onUnmounted(() => {
  playerStore.settings.native.transparent = false

  root.setAttribute('transparent-player', 'false')

  console.log(root.attributes)
})

watch(paused, async () => {
  await togglePause()
})
</script>

<style lang="scss">
@import url('~/assets/css/native.scss');
</style>
