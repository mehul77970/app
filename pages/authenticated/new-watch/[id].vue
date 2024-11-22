<script lang="ts" setup>
const settingsStore = useSettingsStore()
const route = useRoute()

const videoID = route.params.id as string
const audioIndex = route.query.audioIndex as string
const subtitleIndex = route.query.subtitleIndex as string

onMounted(() => {
  document.body.style.overflow = 'hidden'
  settingsStore.hideSidebar = true
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
  settingsStore.hideSidebar = false
})
</script>

<template>
  <WatchPlayerProvider
    :id="videoID"
    :audio-index
    :subtitle-index
  />
</template>
