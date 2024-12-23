<script setup lang="ts">
const {
  id,
  startPosition = 0,
} = defineProps<{
  id: string
  startPosition?: number
}>()

const videoRef = ref(null as null | HTMLVideoElement)

const playerStore = usePlayerStore()
const mediaBrowserStore = useMediaBrowserStore()

const seeking = computed(() => playerStore.seeking)
const paused = computed(() => playerStore.paused)
const volume = computed(() => playerStore.volume)
const muted = computed(() => playerStore.muted)
const pictureInPicture = computed(() => playerStore.pictureInPicture)
const timelinePosition = computed(() => playerStore.positionTimeline)
const playbackStore = usePlaybackStore()

playerStore.type = 'direct'

onMounted(() => {
  if (!videoRef.value) return
  const video = videoRef.value
  // PiP API is avaliable
  if (document.pictureInPictureEnabled) {
    addComponentEventListener(document, 'enterpictureinpicture', () => {
      playerStore.pictureInPicture = true
    })

    addComponentEventListener(document, 'leavepictureinpicture', () => {
      playerStore.pictureInPicture = false
    })
  }

  // Seek events

  // Seek completed
  addComponentEventListener(video, 'seeked', () => {
    playerStore.seeking.value = false

    playerStore.position = {
      value: video.currentTime,
      percent: getVideoPositionPercent(video),
    }

    playerStore.loading = false

    setBufferedAmount(video.buffered, video.duration)
  })

  // Event to indicate more video chunks were loaded
  addComponentEventListener(video, 'progress', () => {
    setBufferedAmount(video.buffered, video.duration)
  })

  addComponentEventListener(video, 'waiting', () => {
    playerStore.loading = true
  })

  addComponentEventListener(video, 'loadeddata', () => {
    playerStore.loading = false
    playerStore.duration = video.duration * 1000

    video.currentTime = ticksToSeconds(startPosition)
    if (!playerStore.item) return

    playbackStore.startPlaybackProgress(playerStore.item, video.currentTime)
  })

  addComponentEventListener(video, 'playing', () => {
    playerStore.loading = false
  })

  // Video pause event
  addComponentEventListener(video, 'pause', () => {
    playerStore.paused = true
  })

  // Video play/resume event
  addComponentEventListener(video, 'play', () => {
    playerStore.paused = false
  })

  let lastCurrentTime = 0

  addComponentEventListener(video, 'timeupdate', () => {
    playerStore.position = {
      value: video.currentTime,
      percent: getVideoPositionPercent(video),
    }

    if (Math.round(video.currentTime) === lastCurrentTime) return

    lastCurrentTime = Math.round(video.currentTime)

    // setRouteQuery({ startPosition: lastCurrentTime * 10000000 });
  })

  addComponentSetInterval(() => {
    if (Math.round(video.currentTime) === lastCurrentTime) return

    playbackStore.savePlaybackProgress(id, video.currentTime)
  }, 1000)
})

function getVideoPositionPercent(video: HTMLVideoElement) {
  return (video.currentTime / video.duration) * 100
}

function setBufferedAmount(buffer: TimeRanges, duration: number) {
  const endBuffer = buffer.end(0)!

  const bufferedPercentage = (endBuffer / duration) * 100

  playerStore.buffer.percent = bufferedPercentage
}

watch(seeking, (seek, _) => {
  if (!seek.value) return

  if (!videoRef.value) return

  videoRef.value.currentTime = seek.position
})

// Paused/Resume event

watch(paused, (paused, _) => {
  if (!videoRef.value) return

  if (!paused) {
    videoRef.value.play()
    return
  }

  videoRef.value.pause()
})

// Volume change event

watch(volume, (volume, _) => {
  if (!videoRef.value) return

  videoRef.value.volume = volume / 100
})

// Mute event

watch(muted, (muted, _) => {
  if (!videoRef.value) return

  videoRef.value.muted = muted
})

// Picture in picture events
watch(pictureInPicture, (pictureInPicture) => {
  if (!videoRef.value) return

  if (pictureInPicture) {
    videoRef.value.requestPictureInPicture()
    return
  }

  if (document.pictureInPictureElement) document.exitPictureInPicture()
})

watch(timelinePosition, (pos, _) => {
  if (!videoRef.value) return
  videoRef.value.currentTime = pos
})

onUnmounted(() => {
  playbackStore.stopPlaybackProgress(id, playerStore.positionTimeline)
})
</script>

<template>
  <video
    id="video"
    ref="videoRef"
    class="z-0 p-0 m-0 h-full w-fit absolute"
    :src="mediaBrowserStore.generateStreamURL(id)"
    :autoplay="true"
  />
</template>
