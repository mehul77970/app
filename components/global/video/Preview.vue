<script lang="ts" setup>
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'
import { PhCircleNotch, PhCloudX, PhCheckFat } from '@phosphor-icons/vue'
import HLS from 'hls.js'
import { notify } from 'notiwind'

import ms from 'ms'
import { truncate } from '@/lib/utils'

const {
  item,
  showProgress = true,
  episode = false,
  audioIndex,
  subtitleIndex,
  videoIndex,
} = defineProps<{
  item: BaseItemDto
  showProgress?: boolean
  episode?: boolean
  audioIndex?: number
  subtitleIndex?: number
  videoIndex?: number
}>()

const muted = defineModel<boolean>()

let player = null as null | HLS
let previewTimeout = null as NodeJS.Timeout | null

const video = ref(null as null | HTMLMediaElement)
const preview = ref(null as null | HTMLElement)

const playing = ref(false)
const loading = ref(false)
const error = ref(null as string | null)
const dontUnload = false

const playbackStore = usePlaybackStore()
const mediaBrowserStore = useMediaBrowserStore()

const onPreviewVideo = () => {
  if (error.value) return
  if (player) return
  if (playing.value) return

  // Create a timeout to wait until trying to load preview
  previewTimeout = setTimeout(async () => {
    // If video element doesn't exist don't continue
    if (!video.value) return

    loading.value = true
    playing.value = false

    // If the player already exists return so we don't create duplicates
    if (player) return

    // TODO: Allow HLS configuration
    player = new HLS({ debug: false })

    try {
      const info = await playbackStore.getPlaybackInfo(item.Id!)

      if (info?.MediaSources![0] && !info.MediaSources[0].TranscodingUrl) {
        notify(
          {
            title: 'Unable to preview video',
            type: 'error',
            text: 'This media cannot be transcoded',
            group: 'bottom',
          },
          5000,
        )

        error.value = 'This media cannot be transcoded'

        playing.value = false
        loading.value = false

        player = null
        return
      }

      playbackStore.setPlaybackInfo(info)

      // Set playback height and width to preview size
      playbackStore.setPlaybackHeightAndWidth(400, undefined)

      if (audioIndex) {
        playbackStore.setPlaybackAudioIndex(audioIndex.toString())
      }

      if (subtitleIndex) {
        playbackStore.setPlaybackSubtitleIndex(subtitleIndex.toString())
      }

      if (videoIndex) {
        playbackStore.setPlaybackVideoIndex(videoIndex.toString())
      }

      // Load our transcoding URL from playbackInfo
      player.loadSource(playbackStore.transcodingUrl)

      // Attach our HLS stream to a video element in the page
      player.attachMedia(video.value)
    }
    catch (e: unknown) {
      const errorMessage = `Couldn't preview ${item.Name}: ${truncate(` ${(e as Error).message}`, { length: 35, position: 'middle' })}`

      notify(
        {
          title: 'Unable to preview video',
          type: 'error',
          text: errorMessage,
          group: 'bottom',
        },
        5000,
      )

      error.value = errorMessage

      playing.value = false
      loading.value = false

      player = null
    }

    // Set playing to true when we get the first video segment from HLS
    player?.on(HLS.Events.FRAG_LOADED, () => {
      loading.value = false
      playing.value = true
    })

    // Seek Video
    video.value.currentTime = calculateStartPosition()
  }, 500)
}

const onStopPreviewVideo = () => {
  if (error.value || dontUnload) return

  if (previewTimeout) {
    clearTimeout(previewTimeout)
    previewTimeout = null
  }

  if (!player || !video.value) return

  player.destroy()
  video.value.pause()

  player = null
  playing.value = false
  loading.value = false
}

const getTimeRemaining = () => {
  if (!item.UserData?.PlaybackPositionTicks) return
  return ms(
    (item.RunTimeTicks! - item.UserData!.PlaybackPositionTicks!) / 10000,
  )
}

const getPlayerProgressPercent = () => {
  return `${item.UserData?.PlayedPercentage}%`
}

// TODO: Make a util
const calculateStartPosition = () => {
  return (item!.UserData!.PlaybackPositionTicks ?? 0) / 10000000
}

// TODO: Make a composable/directive
const onLongPress = (element: HTMLElement, callback: () => void) => {
  let timer: NodeJS.Timeout | null

  element.addEventListener('touchstart', () => {
    timer = setTimeout(() => {
      timer = null
      callback()
    }, 500)
  })

  function cancel() {
    if (!timer) return

    clearTimeout(timer)
  }

  element.addEventListener('touchend', cancel)
  element.addEventListener('touchmove', cancel)
}

onMounted(() => {
  if (!preview.value) return

  onLongPress(preview.value, () => {
    if (playing.value) {
      onStopPreviewVideo()
      return
    }

    onPreviewVideo()
  })

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) return
      if (!playing.value) return

      console.log(
        'Stopping playback of',
        item.Name,
        'because it left the viewport',
      )

      onStopPreviewVideo()
    },
    { threshold: 0.05 },
  )

  observer.observe(preview.value!)
})

const startWatching = async () => {
  playbackStore.setPlayer(player!) // TODO: Quick Load (Stability? Questionable.)

  await navigateTo({
    path: `/authenticated/new-watch/${item.Id}`,
    query: {
      audioIndex: NaNAsUndefined(audioIndex),
      subtitleIndex: NaNAsUndefined(subtitleIndex),
      videoIndex: NaNAsUndefined(videoIndex),
      position: video.value?.currentTime || calculateStartPosition(),
    },
  })
}

const NaNAsUndefined = (num?: number) => {
  if (!num || isNaN(num)) return

  return num
}
</script>

<template>
  <div
    ref="preview"
    class="video-preview aspect-video lg:h-fit lg:max-w-[600px] max-w-[100%] inline-flex flex-col justify-center items-center relative group cursor-pointer rounded-lg select-none selectable"
    @mouseenter="onPreviewVideo"
    @focus="onPreviewVideo"
    @blur="onStopPreviewVideo"
    @mouseleave="onStopPreviewVideo"
    @click="startWatching"
  >
    <div
      class="bg-black video-preview aspect-video lg:h-fit w-full inline-flex flex-col justify-center items-center relative group cursor-pointer rounded-lg select-none"
    >
      <Transition name="fade">
        <img
          v-if="!playing"
          :src="
            mediaBrowserStore.generateImageURL(
              item.Id!!,
              undefined,
              700,
              450,
              85,
            )
          "
          class="w-full h-full object-cover object-center preview-fade rounded-lg"
        >
      </Transition>

      <video
        v-show="playing"
        :id="`video-preview-${item.Id}`"
        ref="video"
        class="absolute w-full h-full object-cover transition-all duration-250 ease-in-out rounded-lg bg-black"
        muted
        autoplay
        disablePictureInPicture
      />

      <Transition name="fade">
        <div
          v-if="!playing && loading"
          class="absolute justify-center items-center text-blue-500 group-hover:inline-flex"
        >
          <PhCircleNotch
            :size="72"
            weight="bold"
            class="animate-spin"
          />
        </div>
      </Transition>

      <Transition name="fade">
        <!-- TODO: Better mute button -->
        <div
          v-if="playing && false"
          class="inline-flex flex-col w-full gap-2 p-8 absolute h-full items-center justify-end mb-8 opacity-75"
        >
          <Button v-model="muted">
            Toggle Mute
          </Button>
        </div>
      </Transition>

      <Transition name="fade">
        <div
          v-if="!playing"
          class="inline-flex flex-col justify-end w-full gap-2 p-8 absolute h-full"
        >
          <div class="inline-flex justify-between items-end flex-wrap">
            <div class="inline-flex flex-col gap-1 w-full">
              <div
                v-if="item.SeriesName && item.SeasonName"
                class="season-series inline-flex gap-2 w-full justify-start items-center flex-wrap"
              >
                <span
                  v-if="!episode"
                  class="font-semibold"
                >{{
                  item.SeriesName
                }}</span>
                <span
                  v-else
                  class="font-semibold"
                >
                  <span
                    v-if="
                      item.IndexNumber
                        && !item.Name!!.includes(item.IndexNumber.toString())
                    "
                  >{{ item.IndexNumber }}.</span>
                  {{ item.Name }}
                </span>
                <span
                  v-if="!episode"
                  class="text-white/75"
                >{{
                  item.SeasonName
                }}</span>
              </div>

              <div class="name inline-flex gap-2 justify-between items-center">
                <span
                  v-if="!episode"
                  class="font-semibold"
                >{{
                  item.Name
                }}</span>

                <span
                  v-if="showProgress"
                  class="text-white/75 text-sm ml-auto"
                >{{ getTimeRemaining() }} left</span>
                <span
                  v-if="!showProgress"
                  class="text-white/75 text-sm ml-auto"
                >{{ getTimeRemaining() }}</span>
              </div>
            </div>
          </div>

          <div
            v-if="showProgress && !playing"
            class="percentage h-2 w-full bg-gray-500 rounded-lg inline-flex justify-start"
          >
            <div
              class="inner-percent bg-blue-400 rounded-lg"
              :style="{ width: getPlayerProgressPercent() }"
            />
          </div>

          <div
            v-if="item.UserData?.Played && !playing"
            class="absolute m-2 right-0 top-0 p-2 bg-black/50 text-green-400 rounded-full inline-flex items-center justify-center font-semibold"
          >
            <PhCheckFat
              :size="18"
              weight="fill"
            />
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div
          v-if="error"
          class="inline-flex flex-col w-full h-full justify-center items-center backdrop-blur-sm backdrop-saturate-0 rounded-lg text-red-500"
        >
          <PhCloudX
            weight="fill"
            :size="72"
            class=""
          />
          <span class="font-semibold text-center">{{ error }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.preview-fade {
  mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.05) 30%,
    rgba(0, 0, 0, 0.1) 40%,
    rgba(0, 0, 0, 0.8) 100%
  );
  background-color: black;
  object-fit: cover;
}
</style>
