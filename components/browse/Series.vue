<script setup lang="ts">
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

const { id } = defineProps<{ id: string }>()

const mediaStore = useMediaBrowserStore()
const breadcrumbStore = useBreadcrumbStore()

const series = ref(await mediaStore.getItem(id))
const seasons = await mediaStore.getSeasons(id)
const currentWatch = await mediaStore.getNextUp(series.value.Id || '', 1)
const background = useServerImage(series.value, {
  type: 'Thumb',
  fallback: 'Primary',
  size: 1920, quality: 75,
})
const logo = useServerImage(series.value, { type: 'Logo', size: 600 })

function getSeasonImage(season: BaseItemDto) {
  return useServerImage(season, { type: 'Primary', size: 400, quality: 75 })
}

breadcrumbStore.setBreadcrumbs([
  {
    name: 'Browse',
  },
])
breadcrumbStore.setPage({ name: series.value.Name || 'No Name Provided' })
</script>

<template>
  <BrowseLayoutNew
    v-model:item="series"
    :current-watch="currentWatch[0]"
    :background
    :logo
  >
    <template #sections>
      <section
        class="inline-flex flex-col justify-start pb-4 items-start max-w-full gap-4 w-full"
      >
        <MaterialForeground color="tertiary">
          <h1 class="tracking-wider pl-6 font-semibold text-2xl">
            SEASONS
          </h1>
        </MaterialForeground>
        <Carousel
          class="relative flex w-[100%] max-w-[100%] justify-start z-[2]"
          :opts="{
            dragFree: true,
            skipSnaps: true,
          }"
        >
          <CarouselContent
            class="items-end w-full"
          >
            <CarouselItem
              v-for="(season, index) in seasons"
              :key="index"
              :class="`basis-1/1 ${index == 0 ? 'ml-6' : ''} ${index == seasons.length - 1 ? 'mr-6' : ''}`"
            >
              <div class="flex flex-row gap-4">
                <NuxtLink
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
                      <img
                        :src="getSeasonImage(season)"
                        class="h-full w-auto rounded-lg transition-all duration-250 selectable object-cover"
                      >
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
