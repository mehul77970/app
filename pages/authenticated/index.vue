<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { ticksToSeconds } from '@/composables/ticksToSeconds'
import { formatTime } from '@/lib/utils'

const l = useLoggerStore()
const mediaBrowserStore = useMediaBrowserStore()
const breadcrumbStore = useBreadcrumbStore()

const views = computed(() => mediaBrowserStore.views)
const resumed = computed(() => mediaBrowserStore.resumed)
const firstResumed = computed(() => resumed.value.length > 0
  ? resumed.value[0]
  : {
      Name: 'Start Watching',
      Id: '0',
      ProductionYear: new Date().getFullYear(),
    })

await mediaBrowserStore.getResumedContent()

onMounted(() => {
  l.$log({
    optionalParams: [useServerImage(firstResumed.value, { type: 'Primary' })],
  })
})

breadcrumbStore.setBreadcrumbs([])
breadcrumbStore.setPage({
  name: 'Home',
  path: '/authenticated',
})
</script>

<template>
  <div class="flex min-w-full min-h-full flex-col items-center gap-4">
    <!-- TODO: Make this a component. -->
    <div class="absolute w-full overflow-hidden blur-sm fade-bg object-top h-[80vh] top-0 left-0 fade-gradient">
      <img
        class="w-full h-full object-cover fade-gradient"
        :alt="`${firstResumed?.Name} Cover Art`"
        height="100%"
        width="100%"
        :src="useServerImage(firstResumed)"
      >
    </div>
    <div
      v-if="firstResumed"
      class="flex flex-col justify-center items-center md:items-start h-[80vh] w-full px-24"
    >
      <div class="inline-flex flex-col gap-8 show-content z-[2]">
        <div class="inline-flex flex-col gap-2">
          <img
            :src="
              useServerImage(firstResumed, { type: 'Logo', fallback: 'Logo', size: 600, quality: 75 })
            "
            :alt="`${firstResumed?.Name} Icon Art`"
            loading="lazy"
            width="700"
          >

          <div class="h-1 w-full rounded-lg bg-white/50" />
        </div>

        <div class="show-details inline-flex gap-4 bg-black/25 p-4 rounded-lg">
          <span>{{
            formatTime(ticksToSeconds(firstResumed.RunTimeTicks!!) * 1000)
          }}</span>
          <span>{{ firstResumed.ProductionYear }}</span>

          <span v-if="firstResumed.OfficialRating">{{
            firstResumed.OfficialRating
          }}</span>
          <span>{{ firstResumed.CommunityRating }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-8 justify-start pb-4 items-start w-full">
      <div class="flex flex-col max-w-full gap-8 z-[5]">
        <!-- Continue Watching Section -->
        <section
          id="continue-watching"
          class="inline-flex flex-col justify-startitems-start max-w-full gap-4"
        >
          <h1 class="text-gray-400 tracking-wider pl-6">
            CONTINUE WATCHING
          </h1>

          <Carousel
            class="relative flex max-w-[100%] justify-center items-center gap-4"
            :opts="{ align: 'center' }"
          >
            <CarouselContent>
              <CarouselItem
                v-for="(item, index) in resumed"
                :key="index"
                class="basis-1/1 max-w-full"
              >
                <LazyVideoPreview
                  :item="item!!"
                  :class="`w-[800px] ${index === 0 ? 'ml-6' : ''} ${index === resumed.length - 1 ? 'mr-6' : ''}`"
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </section>
      </div>

      <div class="flex flex-col w-full max-w-full gap-8 z-[5]">
        <!-- MEDIA -->
        <section
          id="continue-watching"
          class="inline-flex flex-col justify-start items-start max-w-full gap-4"
        >
          <h1 class="text-gray-400 tracking-wider pl-6">
            MEDIA
          </h1>

          <Carousel
            class="relative flex max-w-[100%] w-full justify-center"
            :opts="{
              dragFree: true,
              skipSnaps: true,
            }"
          >
            <CarouselContent>
              <CarouselItem
                v-for="(view, index) in views"
                :key="index"
                class="basis-1/1"
              >
                <div
                  :class="`flex flex-row gap-4 ${index === 0 ? 'ml-6' : ''} ${index === views.length - 1 ? 'mr-6' : ''}`"
                >
                  <HomeCarouselItem
                    :id="view.Id"
                    :name="view.Name!!"
                    :type="view.CollectionType"
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-gradient {
  mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.4) 30%,
    rgba(0, 0, 0, 0.8) 40%,
    rgba(0, 0, 0, 0.9) 80%,
    rgba(0, 0, 0, 0.4) 100%
  );
}
</style>
