<script setup lang="ts">
import type { EmblaCarouselType } from 'embla-carousel'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Radial from '@/components/ui/radial/Radial.vue'
import { getDefaultMediaStreams, getMediaSources } from '~/lib/player'

const { id, parentId } = defineProps<{ id: string, parentId: string }>()

const episodesCarousel = ref(null as { carouselApi: EmblaCarouselType } | null)
const mediaStore = useMediaBrowserStore()

const season = await mediaStore.getItem(id)
const episodes = await mediaStore.getEpisodesOfSeason(parentId, id, 99999)

const staticBackground = mediaStore.generateImageURL(
  parentId,
  undefined,
  1200,
  1200,
)
const logo = mediaStore.generateImageURL(parentId, 'Logo/0', 600)
const currentWatch = await mediaStore.getNextUp(season.Id!, 1)

// TODO: Configure if we should try to figure out video/audio/subtitle track info, can make the inital load slower.

const episode = await mediaStore.getItem(episodes[0].Id || '')
const defaultSources = getDefaultMediaStreams(episode)

const { videoSources, audioSources, subtitleSources } = getMediaSources(episode)

const getEpisodeImage = (episode: string) =>
  mediaStore.generateImageURL(episode, undefined, 720, 480)

const background = () => {
  if (!currentWatch[0]) return staticBackground

  return mediaStore.generateImageURL(
    currentWatch[0].Id!,
    undefined,
    1200,
    1200,
  )
}

onMounted(() => {
  if (!episodesCarousel.value) return

  const carouselAPI = episodesCarousel.value.carouselApi

  // Automatically scroll to currently playing episode
  const currentEpisodeIndex = currentWatch[0]
    ? episodes.findIndex(ep => ep.Id == currentWatch[0].Id!)
    : 0

  console.log('Should scroll to ep index', currentEpisodeIndex)
  carouselAPI.scrollTo(currentEpisodeIndex)
})
</script>

<template>
  <BrowseLayoutNew
    :item="season"
    :background="background()"
    :logo
    :default-sources
    :video-sources
    :audio-sources
    :subtitle-sources
  >
    <template #sections>
      <section
        class="inline-flex flex-col justify-start pb-4 items-start max-w-full gap-4 mt-[72px]"
      >
        <h1 class="text-gray-400 tracking-wider pl-6">
          EPISODES
        </h1>

        <Carousel
          ref="episodesCarousel"
          class="relative flex max-w-[100%] justify-start items-start rounded-lg z-[2]"
          :opts="{
            dragFree: true,
            skipSnaps: false,
          }"
        >
          <CarouselContent
            v-focus-section
            class="items-end"
          >
            <CarouselItem
              v-for="(episode, index) in episodes"
              :key="index"
              :class="`basis-1/1 lg:basis-1/4 ${index == 0 ? 'ml-6' : ''}`"
            >
              <div>
                <NuxtLink
                  v-focus
                  :to="{
                    name: 'authenticated-new-watch-id',
                    params: { id: episode.Id },
                  }"
                  class="group"
                >
                  <div
                    class="season inline-flex flex-col justify-center gap-2 w-[100%] group select-none"
                  >
                    <h3
                      class="text-lg group-hover:underline group-hover:text-opacity-75 group-focus-visible:underline group-focus-visible:text-opacity-75 text-white"
                    >
                      {{ episode.Name }}
                    </h3>
                    <div class="rounded-lg group relative selectable">
                      <div class="bg-black rounded-lg">
                        <ImageWithPlaceholder
                          :src="getEpisodeImage(episode.Id!!)"
                          class-name="h-fit w-full aspect-video object-cover rounded-lg transition-all duration-250 group-hover:opacity-75 z-[3]"
                        />
                      </div>

                      <!-- TODO: Add short stats -->
                      <div
                        v-if="
                          episode.UserData?.PlaybackPositionTicks != 0
                            || episode.UserData?.Played
                        "
                        class="absolute h-full rounded-lg max-w-full z-[5] top-0 p-4 w-full inline-flex justify-end text-slate-300"
                      >
                        <Radial
                          :max="100"
                          :min="0"
                          :value="
                            episode.UserData!!.Played
                              ? 100
                              : episode.UserData?.PlayedPercentage!!
                          "
                          class-name="size-8"
                          gauge-primary-color="rgb(255, 255, 255)"
                          gauge-secondary-color="rgba(0, 0, 0, 0.5)"
                          :show-complete="true"
                        />
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </section>
    </template>
  </BrowseLayoutNew>
</template>
