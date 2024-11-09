<script setup lang="ts">
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

const { id } = defineProps<{ id: string }>()

const mediaStore = useMediaBrowserStore()

const series = await mediaStore.getItem(id)
const seasons = await mediaStore.getSeasons(id)

const background = mediaStore.generateImageURL(
  series.Id!,
  undefined,
  1200,
  1200,
)
const logo = mediaStore.generateImageURL(series.Id!, 'Logo/0', 600)

const getSeasonImage = (season: string) =>
  mediaStore.generateImageURL(season, undefined, 300, 430)
</script>

<template>
  <BrowseLayoutNew
    :item="series"
    :background
    :logo
  >
    <template #sections>
      <section
        class="inline-flex flex-col justify-start pb-4 items-start max-w-full gap-4 mt-[72px] w-full"
      >
        <h1 class="text-gray-400 tracking-wider pl-6">
          SEASONS
        </h1>

        <Carousel
          class="relative flex w-[100%] max-w-[100%] justify-start z-[2]"
          :opts="{
            dragFree: true,
            skipSnaps: true,
          }"
          :plugins="[WheelGesturesPlugin({ forceWheelAxis: 'y' })]"
        >
          <CarouselContent
            v-focus-section
            class="items-end w-full"
          >
            <CarouselItem
              v-for="(season, index) in seasons"
              :key="index"
              :class="`basis-1/1 ${index == 0 ? 'ml-6' : ''}`"
            >
              <div class="flex flex-row gap-4">
                <NuxtLink
                  v-focus
                  :to="{
                    name: 'authenticated-browse-season-id',
                    params: { id: season.Id },
                    query: { parent: series.Id, parentName: series.Name },
                  }"
                  class="group"
                >
                  <div
                    class="season inline-flex flex-col justify-start gap-2 max-w-full sm:w-[320px] h-[500px]"
                  >
                    <h3
                      class="text-lg group-hover:underline group-focus-within:underline group-focus-within:text-opacity-75 group-hover:text-opacity-75 text-white"
                    >
                      {{ season.Name }}
                    </h3>
                    <div
                      class="transition-all duration-250 hover:scale-[101%] rounded-lg h-full"
                    >
                      <ImageWithPlaceholder
                        :src="getSeasonImage(season.Id!!)"
                        class-name="h-full w-auto rounded-lg transition-all duration-250 selectable object-cover"
                      />
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
