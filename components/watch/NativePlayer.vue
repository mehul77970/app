<script setup lang="ts">
import { setURL, start } from '@/native/Player'

const playerStore = usePlayerStore()
const mediaBrowser = useMediaBrowserStore()

const item = computed(() => playerStore.item)

onMounted(async () => {
  if (!item.value) return

  const streamURL = mediaBrowser.generateDownloadURL(item.value)

  await setURL(streamURL)

  setTimeout(() => {
    start()
  }, 200)
})
</script>

<template>
  <div class="fixed flex justify-center items-center">
    MPV Player
  </div>
</template>

<style>
html, body {
  background-color: transparent;
}

</style>