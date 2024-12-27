<script setup lang="ts">
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'
import {
  PhDotsThreeVertical,
  PhHeart,
  PhPlay,
  PhStar,
} from '@phosphor-icons/vue'
import { animate } from 'motion'
import { hexFromArgb, sourceColorFromImage, themeFromSourceColor } from '@/lib/material'
import { Button } from '@/components/ui/button'
import Radial from '@/components/ui/radial/Radial.vue'
import type { Scheme as MaterialScheme } from '@/lib/material'

const {
  background,
  logo,
  defaultSources,
  videoSources,
  audioSources,
  subtitleSources,
  currentWatch,
} = defineProps<{
  currentWatch?: BaseItemDto
  background: string
  logo: string
  defaultSources?: {
    video: VideoSource | null
    audio: AudioSource | null
    subtitle: SubtitleSource | null
  }
  videoSources?: VideoSource[]
  audioSources?: AudioSource[]
  subtitleSources?: SubtitleSource[]
}>()

const router = useRouter()
const item = defineModel<BaseItemDto>('item', { required: true })
const mediaBrowserStore = useMediaBrowserStore()
const scheme = ref(undefined as unknown as MaterialScheme)

const state = ref({
  load: {
    like: false,
    play: false,
  },
})

const bgImageLoaded = async (ev: Event) => {
  const imageElement = ev.currentTarget as HTMLElement | null
  if (!imageElement) return
  animate(imageElement, { opacity: [0, 1], y: [20, 0], filter: ['blur(8px)', 'blur(4px)'] }, { duration: 0.5, delay: 0.04 }).play()

  const imageLowQuality = new Image()

  imageLowQuality.src = useServerImage(item.value!, { type: 'Thumb', size: 32, quality: 75 })
  imageLowQuality.crossOrigin = 'anonymous'

  const generatedPallete = await themeFromSourceColor((await sourceColorFromImage(imageLowQuality)))

  scheme.value = generatedPallete.schemes.dark
}

const toggleLike = async () => {
  if (item.value.UserData?.IsFavorite) return await unlike()

  return await like()
}

const like = async () => {
  state.value.load.like = true
  try {
    item.value.UserData = await mediaBrowserStore.favoriteItem(item.value)
  }
  finally {
    state.value.load.like = false
  }
}

const unlike = async () => {
  state.value.load.like = true
  try {
    item.value.UserData = await mediaBrowserStore.unfavoriteItem(item.value)
  }
  finally {
    state.value.load.like = false
  }
}

const play = () => {
  router.push({ name: 'authenticated-new-watch-id', params: { id: currentWatch?.Id || '' } })
}
</script>

<template>
  <!-- @ts-expect-error Invalid schema -->
  <MaterialSchemeProvider :scheme="scheme as any">
    <MaterialAppBG color="background" />
    <div class="w-full">
      <div class="flex flex-col justify-center items-start min-h-[100vh] w-full py-8">
        <img
          id="bg-image-layout"
          crossorigin="anonymous"
          :src="background"
          class="absolute h-[100vh] w-full overflow-hidden blur-[8px] fade-bg object-cover top-0 left-0 fade-gradient -z-1"
          alt="hello"
          @load="bgImageLoaded"
        >
        <div class="inline-flex flex-row flex-wrap justify-center md:p-8 p-4 items-end gap-8 show-content z-[2] max-w-full">
          <div class="inline-flex flex-col justify-center items-center gap-2 lg:w-[600px] w-[85%] max-w-full">
            <img
              :src="useServerImage(item!, { type: 'Primary', size: 600 })"
              class="w-full rounded-2xl"
            >
          </div>

          <div
            class="show-details inline-flex flex-col gap-3 p-4 rounded-lg max-w-[90%] lg:text-[1.2em]"
          >
            <div class="inline-flex flex-col justify-between flex-wrap">
              <MaterialForeground color="primary">
                <h1
                  class="rounded-lg md:text-[72px] md:leading-[72px] text-4xl font-bold inline-flex p-0 md:mb-4 align-top max-w-full"
                >
                  {{ item.Name }}
                </h1>
              </MaterialForeground>
              <div class="attributes inline-flex flex-row gap-2 justify-start items-center mt-4">
                <MaterialBackground color="secondary">
                  <div
                    v-if="item.ProductionYear"
                    class="attribute px-5 py-1 inline-flex justify-center items-center gap-2 rounded-xl use-material-bg"
                  >
                    <MaterialForeground color="onSecondary">
                      {{ item.ProductionYear }}
                    </MaterialForeground>
                  </div>
                </MaterialBackground>

                <MaterialBackground color="secondary">
                  <div
                    v-if="item.CommunityRating"
                    class="attribute px-5 py-1 inline-flex justify-center items-center gap-2 rounded-xl use-material-bg"
                  >
                    <MaterialForeground color="onSecondary">
                      <PhStar
                        weight="fill"
                        class="lg:h-[1.25rem]"
                      />
                    </MaterialForeground>
                    <MaterialForeground color="onSecondary">
                      {{ item.CommunityRating?.toFixed(1) }}
                    </MaterialForeground>
                  </div>
                </MaterialBackground>

                <MaterialBackground color="secondary">
                  <div
                    v-if="item.OfficialRating"
                    class="attribute px-5 py-1 inline-flex justify-center items-center gap-2 rounded-xl use-material-bg"
                  >
                    <MaterialForeground color="onSecondary">
                      {{ item.OfficialRating }}
                    </MaterialForeground>
                  </div>
                </MaterialBackground>
              </div>
              <div class="actions inline-flex flex-row gap-2 justify-start items-center" />
              <div
                v-if="false"
                class="inline-flex gap-2 items-center justify-center"
              >
                <Button
                  variant="outline"
                  size="icon"
                  @click="play"
                >
                  <PhPlay size="24" />
                </Button>
                <Button
                  v-if="false"
                  variant="ghost"
                >
                  Movie Reel
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  :disabled="state.load.like"
                  @click="toggleLike"
                >
                  <PhHeart
                    :size="24"
                    :weight="item.UserData?.IsFavorite ? 'fill' : 'regular'"
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled
                >
                  <PhDotsThreeVertical
                    :size="24"
                    weight="bold"
                  />
                </Button>
              </div>
            </div>
            <div class="attributes inline-flex flex-wrap flex-row gap-2 justify-start items-center">
              <MaterialBackground
                v-for="(genre, index) in item.GenreItems"
                :key="index"
                color="secondary"
              >
                <div

                  class="attribute px-5 py-1 inline-flex justify-center items-center gap-2 rounded-xl use-material-bg"
                >
                  <MaterialForeground color="onSecondary">
                    {{ genre.Name }}
                  </MaterialForeground>
                </div>
              </MaterialBackground>
            </div>
            <div class="inline-flex flex-col justify-start items-start gap-1 text-[1rem]">
              <div
                v-if="defaultSources?.video"
                id="video"
                class="inline-flex gap-4 items-center justify-center w-full"
              >
                <h3 class="text-white/75 w-[120px]">
                  Video
                </h3>

                <Select
                  :default-value="defaultSources.video.source.Index?.toString() || '0'
                  "
                >
                  <SelectTrigger class="flex-grow-1">
                    <SelectValue :placeholder="defaultSources.video?.title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="(video, index) in videoSources"
                      :key="index"
                      :value="video?.source?.Index?.toString() || '0'"
                    >
                      <TextVideoWithFeatures
                        v-if="video"
                        :video="video"
                      />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div
                v-if="defaultSources?.audio"
                id="audio"
                class="inline-flex gap-4 items-center justify-center w-full"
              >
                <h3 class="text-white/75 w-[120px]">
                  Audio
                </h3>

                <Select
                  :default-value="defaultSources.audio.source.Index?.toString() || '0'
                  "
                >
                  <SelectTrigger class="flex-grow-1">
                    <SelectValue :placeholder="defaultSources.video?.title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="(audio, index) in audioSources"
                      :key="index"
                      :value="audio?.source?.Index?.toString() || '0'"
                    >
                      <TextAudioWithFeatures
                        v-if="audio"
                        :audio="audio"
                      />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div
                v-if="defaultSources?.subtitle"
                id="subtitle"
                class="inline-flex gap-4 items-center justify-center w-full"
              >
                <h3 class="text-white/75 w-[120px]">
                  Subtitle
                </h3>

                <Select
                  :default-value="defaultSources.subtitle.source?.Index?.toString() || '0'
                  "
                >
                  <SelectTrigger class="flex-grow-1">
                    <SelectValue :placeholder="defaultSources.subtitle?.title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="(subtitle, index) in subtitleSources"
                      :key="index"
                      :value="subtitle?.source?.Index?.toString() || '0'"
                    >
                      {{ subtitle.title }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <MaterialForeground color="onBackground">
              <p
                v-if="item.Overview"
                class="max-w-full w-[700px] overview"
              >
                {{ item.Overview }}
              </p>

              <p
                v-else
                class="max-w-full w-[700px] overview"
              >
                No overview provided
              </p>
            </MaterialForeground>

            <div class="item-details inline-flex max-w-[800px] w-full flex-col justify-start items-start text-white/50">
              <!-- <div class="inline-flex flex-col gap-2" v-if="movie.DateCreated">
                                        <h2 class="text-lg">Date Added</h2>

                                        <div class="inline-flex flex-wrap gap-[4px] text-white/50">
                                            <span>{{ movie.DateCreated }}</span>
                                        </div>
                                    </div> -->

              <div class="inline-flex flex-wrap justify-center items-center gap-3 complete mt-3">
                <MaterialForeground color="onBackground">
                  <Radial
                    :max="100"
                    :min="0"
                    :value="item.UserData!!.Played
                      ? 100
                      : item.UserData?.PlayedPercentage!!
                    "
                    class-name="size-8"
                    gauge-secondary-color="rgba(0, 0, 0, 0.5)"
                    gauge-primary-color="currentColor"
                    :show-complete="true"
                  />
                </MaterialForeground>
                <MaterialForeground color="onBackground">
                  <span v-if="!item.UserData?.Played">{{ item.UserData?.UnplayedItemCount }} episodes left</span>
                  <span v-else>Completed</span>
                </MaterialForeground>
              </div>
            </div>
          </div>
        </div>

        <slot name="sections" />
      </div>
    </div>
  </MaterialSchemeProvider>
</template>

<style>
.fade-gradient {
  mask-image: linear-gradient(to top,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.02) 30%,
      rgba(0, 0, 0, 0.05) 40%,
      rgba(0, 0, 0, 0.6) 80%,
      rgba(0, 0, 0, 0.5) 100%);
}
</style>
