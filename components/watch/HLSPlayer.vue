<script setup lang="ts">
import type { PlaybackInfoResponse } from '@jellyfin/sdk/lib/generated-client'
import HLS, { type BufferAppendedData } from 'hls.js'

import { addComponentEventListener } from '@/composables/addComponentEventListener'
import { addComponentSetInterval } from '@/composables/addComponentSetInterval'
import { ticksToSeconds } from '@/composables/ticksToSeconds'

const {
  info = usePlaybackStore().info,
  id,
  audioIndex,
  videoIndex,
  subtitleIndex,
  startPosition = 0,
} = defineProps<{
  info?: PlaybackInfoResponse
  id: string
  audioIndex: number
  videoIndex: number
  subtitleIndex: number
  startPosition?: number
}>()

const playbackStore = usePlaybackStore()
const playerStore = usePlayerStore()
const deviceStore = useDeviceStore()

console.log('Player debug state', playerStore.debug)

const player = new HLS({
  backBufferLength: 60,
  maxBufferLength: 120,
  debug: playerStore.debug.enabled && playerStore.debug.hls ? playerStore.createLogger() : false,
})

// User config
playbackStore.setPlaybackAudioIndex(audioIndex)
playbackStore.setPlaybackVideoIndex(videoIndex)
playbackStore.setPlaybackSubtitleIndex(subtitleIndex)

const video = ref(null as null | HTMLVideoElement)

const seeking = computed(() => playerStore.seeking)
const paused = computed(() => playerStore.paused)
const volume = computed(() => playerStore.volume)
const muted = computed(() => playerStore.muted)
const pictureInPicture = computed(() => playerStore.pictureInPicture)
const timelinePosition = computed(() => playerStore.positionTimeline)

const videoSource = computed(() => playerStore.video)
const audioSource = computed(() => playerStore.audio)

let tOffset = 0.0

const finishLoader = ref(false)
const loaderAnimationFinished = ref(false)
onMounted(async () => {
  if (!video.value) return

  playerStore.duration = playerStore.item?.RunTimeTicks || 0 / 10000
  const videoElement = video.value
  const getAppendedOffset = (eventName: string, frag: BufferAppendedData) => {
    if (
      frag.frag.type === 'main'
      && frag.frag.sn !== 'initSegment'
      && frag.frag.elementaryStreams.audiovideo
    ) {
      const { start, startDTS, startPTS, maxStartPTS, elementaryStreams }
        = frag.frag

      if (!elementaryStreams.audiovideo) return

      tOffset = elementaryStreams.audiovideo.startPTS - start
      // player.off(HLS.Events.BUFFER_APPENDED, getAppendedOffset);

      playerStore.subtitleTimeSyncOffset = tOffset
      console.log('video timestamp offset:', tOffset, {
        start,
        startDTS,
        startPTS,
        maxStartPTS,
        elementaryStreams,
      })
    }
  }

  player.on(HLS.Events.BUFFER_APPENDED, getAppendedOffset)

  player.attachMedia(videoElement)
  const { height } = window.screen
  console.log(window.screen)

  if (!Number.isNaN(playerStore.settings.video.global.bitrate)) {
    console.log('Is this running')
    playbackStore.setPlaybackVideoBitrate(
      parseInt(playerStore.settings.video.global.bitrate),
    )
    playbackStore.setPlaybackHeightAndWidth(
      playerStore.settings.video.global.height,
      playerStore.settings.video.global.height,
    )
  }

  console.log('Set bitrate to', playbackStore)
  if (playerStore.settings.video.global.bitrate == 'auto') {
    playbackStore.setPlaybackHeightAndWidth(height, height)
    playbackStore.setPlaybackVideoBitrate(deviceStore.bitrate)
    console.log('Set playback bitrate to approx. ', deviceStore.bitrate)
  }

  if (playerStore.settings.video.global.bitrate == 'display') {
    console.log('Height', height)
    let bitrate = 8000000
    if (height >= 2160) {
      bitrate = 120000000
    }
    else if (height >= 1440) {
      bitrate = 100000000
    }
    else if (height >= 1080) {
      bitrate = 60000000
    }
    else if (height >= 720) {
      bitrate = 8000000
    }
    else if (height <= 480) {
      bitrate = 3000000
    }

    console.log('Video bitrate on display should be approx.', bitrate)
    playbackStore.setPlaybackVideoBitrate(bitrate)
    playbackStore.setPlaybackHeightAndWidth(height, height)
  }

  if (playerStore.settings.video.global.bitrate == 'source') {
    if (playbackStore.info?.MediaSources?.[0]) {
      const sourceBitrate = playbackStore.info?.MediaSources[0].Bitrate

      playbackStore.setPlaybackVideoBitrate(sourceBitrate!)
    }
  }

  if (!playbackStore._transcodingUrl) return

  loadSource(playbackStore._transcodingUrl.href)

  console.log('HLSPLayer is loading URL: ', playbackStore.transcodingUrl)

  // Start video at whatever the startPosition should be.
  videoElement.currentTime = ticksToSeconds(startPosition)

  // Start capturing element/page events
  capturePageEvents(videoElement)

  let lastSavedTime = 0
  // TODO: User configurable
  addComponentSetInterval(async () => {
    if (lastSavedTime === videoElement.currentTime) return

    lastSavedTime = videoElement.currentTime

    await playbackStore.savePlaybackProgress(id, lastSavedTime)

    console.log('Saved current time position of player', lastSavedTime)
  }, 5000)

  playerStore.loaded = true
})

const capturePageEvents = (video: HTMLVideoElement) => {
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
    console.log('Fire waiting event')

    playerStore.loading = true
  })

  addComponentEventListener(video, 'loadeddata', () => {
    console.log('Fired loadeddata event')

    finishLoader.value = true
    playerStore.loading = false
  })

  addComponentEventListener(video, 'canplay', () => {
    console.log('Fired canplay')
    finishLoader.value = true
  })

  addComponentEventListener(video, 'playing', () => {
    console.log('Fired playing event')

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

  useFrameAccurateSync(video)
}

onUnmounted(() => {
  if (window.SECRET_PLAYER_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
    playbackStore.clearPlayer()
  }

  if (!video.value) return

  console.log(
    'Sending STOP on playback progress with current player time',
    video.value.currentTime,
  )

  player.destroy()
  playbackStore.stopPlaybackProgress(id, video.value.currentTime)

  if (!info?.PlaySessionId)
    return console.error(
      'Couldn\'t find play session id, so I couldn\'t stop the current transcode',
    )

  playbackStore.stopPlaybackTranscode(info?.PlaySessionId)
  playerStore.resetPlayer()
})

// Seeking event

watch(seeking, (seek, _) => {
  if (!seek.value) return

  if (!video.value) return

  console.log('HLSPlayer Seeking to: ', seek.position)

  video.value.currentTime = seek.position
})

// Paused/Resume event

watch(paused, (paused, _) => {
  if (!video.value) return

  if (!paused) {
    video.value.play()
    return
  }

  video.value.pause()
})

// Volume change event

watch(volume, (volume, _) => {
  if (!video.value) return

  video.value.volume = volume / 100
})

// Mute event

watch(muted, (muted, _) => {
  if (!video.value) return

  video.value.muted = muted
})

// Picture in picture events
watch(pictureInPicture, (pictureInPicture) => {
  if (!video.value) return

  if (pictureInPicture) {
    video.value.requestPictureInPicture()
    return
  }

  if (document.pictureInPictureElement) document.exitPictureInPicture()
})

// TODO: Handle changing video sources
watch(videoSource, () => {
  playerStore.loading = true
})

watch(audioSource, async (audioSource) => {
  console.log('Should load new source', audioSource)
  if (!video.value) return
  playerStore.loading = true

  const lastTime = video.value.currentTime

  useRouter().replace({
    path: useRouter().currentRoute.value.fullPath,
    query: {
      audioIndex: audioSource?.source.Index,
    },
  })

  await playbackStore.getPlaybackInfo(
    id,
    {
      audioIndex: audioSource?.source.Index,
      last: playbackStore.lastPlaybackInfo,
    },
  )

  const newAudioIndex = audioSource?.source.Index

  if (!newAudioIndex) return

  playbackStore.setPlaybackAudioIndex(newAudioIndex)

  loadSource(playbackStore.transcodingUrl)

  video.value.currentTime = lastTime
})

watch(timelinePosition, (pos, _) => {
  if (!video.value) return
  video.value.currentTime = pos
})

const setBufferedAmount = (buffer: TimeRanges, duration: number) => {
  const endBuffer = buffer.end(0)!

  const bufferedPercentage = (endBuffer / duration) * 100

  playerStore.buffer.percent = bufferedPercentage
}

const getVideoPositionPercent = (video: HTMLVideoElement) => {
  return (video.currentTime / video.duration) * 100
}

const useFrameAccurateSync = (video: HTMLVideoElement) => {
  if (!('requestVideoFrameCallback' in HTMLVideoElement.prototype)) {
    console.warn(
      'Can\'t use frame accurate time sync for subtitles, subtitle sync may be off.',
    )

    addComponentEventListener(video, 'timeupdate', () => {
      if (playerStore.subtitleSyncCallback)
        playerStore.subtitleSyncCallback(
          Math.max(0, video.currentTime - tOffset),
        )
    })

    return
  }

  console.log(
    'You have access to frame accurate time sync! Subtitle sync should be greatly improved :)',
  )

  const onVideoFrameCallback = (
    _: unknown,
    metadata: VideoFrameCallbackMetadata,
  ) => {
    if (playerStore.subtitleSyncCallback)
      playerStore.subtitleSyncCallback(
        Math.max(0, metadata.mediaTime - tOffset),
      )

    video.requestVideoFrameCallback(onVideoFrameCallback)
  }

  video.requestVideoFrameCallback(onVideoFrameCallback)
}

const loadSource = (url: string) => {
  console.log('Attempting to load source: ', url)

  player.loadSource(url)
}

// const setRouteQuery = (query: Record<string, string>) => {
//   const current = router.currentRoute.value

//   router.replace({ path: current.fullPath, query: { ...current.query, ...query } })
// }
</script>

<template>
  <video
    id="video"
    ref="video"
    class="z-0 p-0 m-0 h-full w-fit absolute"
    :autoplay="true"
  />

  <Transition name="fade-short-slide">
    <div
      v-if="!(loaderAnimationFinished && finishLoader)"
      class="absolute z-[1] h-full w-full"
    >
      <WatchLoad
        v-model="loaderAnimationFinished"
        :name="playerStore.item!!.Name!!"
      />
    </div>
  </Transition>
</template>
