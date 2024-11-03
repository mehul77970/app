<script setup lang="ts">
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { formatTime } from '@/lib/utils'
import { ticksToSeconds } from '@/composables/ticksToSeconds'

const mediaBrowserStore = useMediaBrowserStore()

const views = computed(() => mediaBrowserStore.views)
const resumed = computed(() => mediaBrowserStore.resumed)
const firstResumed = computed(() => resumed.value[0]!)

await mediaBrowserStore.getResumedContent()
</script>

<template>
  <div class="flex min-w-full min-h-full flex-col items-center gap-4 p-6">
    <!-- TODO: Make this a component. -->
    <div
      v-if="firstResumed"
      class="flex flex-col justify-center items-center md:items-start h-[80vh] w-full px-24"
    >
      <img
        :src="
          mediaBrowserStore.generateImageURL(
            firstResumed.Id!!,
            undefined,
            1920,
            undefined,
          )
        "
        class="absolute h-full w-full overflow-hidden z-[1] object-cover object-top top-0 left-0 fade-gradient"
      >
      <div class="inline-flex flex-col gap-8 show-content z-[2]">
        <div class="inline-flex flex-col gap-2">
          <img
            :src="
              mediaBrowserStore.generateImageURL(
                firstResumed.Type == 'Episode'
                  ? firstResumed.SeriesId!!
                  : firstResumed.Id!!,
                'Logo/0',
                1920,
                undefined,
              )
            "
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

    <div class="flex flex-col gap-8 justify-start items-start w-full">
      <div class="flex flex-col max-w-full p-4 gap-8 z-[5]">
        <!-- Continue Watching Section -->
        <section
          id="continue-watching"
          class="inline-flex flex-col justify-start items-start max-w-full gap-4"
        >
          <h1 class="text-gray-400 tracking-wider">
            CONTINUE WATCHING
          </h1>

          <Carousel
            class="relative flex max-w-[100%] justify-center items-center gap-4"
            :opts="{ align: 'center' }"
            :plugins="[WheelGesturesPlugin({ forceWheelAxis: 'y' })]"
          >
            <CarouselContent v-focus-section>
              <CarouselItem
                v-for="(item, index) in resumed"
                :key="index"
                class="basis-1/1 max-w-full"
              >
                <VideoPreview
                  v-focus
                  :item="item!!"
                  class="w-[800px]"
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </section>
      </div>

      <div class="flex flex-col max-w-full p-4 gap-8 z-[5]">
        <!-- MEDIA -->
        <section
          id="continue-watching"
          class="inline-flex flex-col justify-start items-start max-w-full gap-4"
        >
          <h1 class="text-gray-400 tracking-wider">
            MEDIA
          </h1>

          <Carousel
            class="relative flex max-w-[100%] justify-center"
            :opts="{
              dragFree: true,
              skipSnaps: true,
            }"
            :plugins="[WheelGesturesPlugin({ forceWheelAxis: 'y' })]"
          >
            <CarouselContent v-focus-section>
              <CarouselItem
                v-for="(view, index) in views"
                :key="index"
                class="basis-1/1"
              >
                <div class="flex flex-row gap-4">
                  <HomeCarouselItem
                    :id="view.Id"
                    v-focus
                    :name="view.Name!!"
                    :type="view.CollectionType"
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </section>
      </div>

      <!-- My Media Section -->
      <section class="flex flex-col max-w-full p-4 gap-8">
        <div
          class="eyecatch-bar w-full h-[180px] relative bg-[#1e2023] rounded-lg overflow-hidden"
        >
          <img
            src="~/assets/svg/waves.svg"
            class="absolute w-full h-full rounded-lg overflow-hidden object-cover"
          >

          <div
            class="flex justify-center items-center absolute w-full h-full font-bold text-6xl backdrop backdrop-blur-[8px] rounded-lg"
          >
            <span>Your Media</span>
          </div>
        </div>
      </section>
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
