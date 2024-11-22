<script setup lang="ts">
import type { EmblaCarouselType } from 'embla-carousel'
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Radial from '@/components/ui/radial/Radial.vue'
import { getDefaultMediaStreams, getMediaSources } from '~/lib/player'

const { id, parentId, parentName } = defineProps<{ id: string, parentId: string, parentName: string }>()

const episodesCarousel = ref(null as { carouselApi: EmblaCarouselType } | null)
const mediaStore = useMediaBrowserStore()
const breadcrumbStore = useBreadcrumbStore()

const season = await mediaStore.getItem(id)
const episodes = await mediaStore.getEpisodesOfSeason(parentId, id, 99999)

const staticBackground = useServerImage(season, { type: 'Thumb' })
const logo = useServerImage(season, { type: 'Logo', fallback: 'Logo' })
const currentWatch = await mediaStore.getNextUp(season.Id!, 1)

// TODO: Configure if we should try to figure out video/audio/subtitle track info, can make the inital load slower.

const episode = await mediaStore.getItem(episodes[0].Id || '')
const defaultSources = getDefaultMediaStreams(episode)

const { videoSources, audioSources, subtitleSources }
  = getMediaSources(episode)

function getEpisodeImage(episode: BaseItemDto) {
  return useServerImage(episode, { type: 'Primary', fallback: 'Thumb' })
}

function background() {
  if (!currentWatch[0]) return staticBackground

  return useServerImage(currentWatch[0])
}

onMounted(() => {
  if (!episodesCarousel.value) return

  const carouselAPI = episodesCarousel.value.carouselApi

  // Automatically scroll to currently playing episode
  const currentEpisodeIndex = currentWatch[0]
    ? episodes.findIndex(ep => ep.Id == currentWatch[0].Id!)
    : 0

  carouselAPI.scrollTo(currentEpisodeIndex)
})

breadcrumbStore.setBreadcrumbs([
  {
    name: parentName,
    path: `/authenticated/browse/series/${parentId}`,
  },
])
breadcrumbStore.setPage({ name: season.Name || 'No Name Provided' })
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
        class="inline-flex flex-col justify-start pb-4 items-start w-full gap-4 mt-[72px]"
      >
        <h1 class="text-gray-400 tracking-wider pl-6">
          EPISODES
        </h1>

        <Carousel
          ref="episodesCarousel"
          class="relative flex w-full justify-start items-start rounded-lg z-[2]"
          :opts="{
            dragFree: true,
            skipSnaps: false,
          }"
          :plugins="[WheelGesturesPlugin({ forceWheelAxis: 'x' })]"
        >
          <CarouselContent
            v-focus-section
            class="items-end"
          >
            <CarouselItem
              v-for="(ep, index) in episodes"
              :key="index"
              :class="`basis-1/3 lg:basis-1/4 ${index == 0 ? 'ml-6' : ''} ${index == episodes.length - 1 ? 'mr-6' : ''}`"
            >
              <div>
                <NuxtLink
                  v-focus
                  :to="{
                    name: 'authenticated-new-watch-id',
                    params: { id: ep.Id },
                  }"
                  class="group"
                >
                  <div
                    class="season inline-flex flex-col justify-center gap-2 w-[100%] group select-none"
                  >
                    <h3
                      class="text-sm lg:text-lg group-hover:underline group-hover:text-opacity-75 group-focus-visible:underline group-focus-visible:text-opacity-75 text-white"
                    >
                      {{ ep.Name }}
                    </h3>
                    <div class="rounded-lg group relative selectable">
                      <div class="bg-black rounded-lg">
                        <img
                          :src="getEpisodeImage(ep)"
                          class="h-fit w-full aspect-video object-cover rounded-lg transition-all duration-250 group-hover:opacity-75 z-[3]"
                        >
                      </div>

                      <!-- TODO: Add short stats -->
                      <div
                        v-if="
                          ep.UserData?.PlaybackPositionTicks != 0
                            || ep.UserData?.Played
                        "
                        class="absolute h-full rounded-lg max-w-full z-[5] top-0 p-2 md:p-4 w-full inline-flex justify-end text-slate-300"
                      >
                        <Radial
                          :max="100"
                          :min="0"
                          :value="
                            ep.UserData!!.Played
                              ? 100
                              : ep.UserData?.PlayedPercentage!!
                          "
                          class-name="lg:size-8 size-6"
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
