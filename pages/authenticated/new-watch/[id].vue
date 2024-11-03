<script lang="ts" setup>
const route = useRoute()

const videoID = route.params.id as string
const audioIndex = route.query.audioIndex as string
const subtitleIndex = route.query.subtitleIndex as string

onMounted(() => {
  console.log('Audio (Index)', audioIndex)
  console.log('Subtitle (Index)', subtitleIndex)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})
</script>

<template>
  <WatchPlayerProvider
    :id="videoID"
    :audio-index
    :subtitle-index
  />
</template>
