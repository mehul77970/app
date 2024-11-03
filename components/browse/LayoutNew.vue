<script setup lang="ts">
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import {
  PhStar,
  PhPlay,
  PhHeart,
  PhDotsThreeVertical,
} from "@phosphor-icons/vue";
import { Button } from "@/components/ui/button";

import Radial from "@/components/ui/radial/Radial.vue";

const { item, background, logo, video, audio, subtitle } = defineProps<{
  item: BaseItemDto;
  background: string;
  logo: string;
  video?: VideoSource;
  audio?: AudioSource;
  subtitle?: SubtitleSource;
}>();
</script>

<template>
  <div class="w-full">
    <div
      class="flex flex-col justify-center items-start min-h-[100vh] w-full mt-[128px]"
    >
      <ImageWithPlaceholder
        :src="background"
        class-name="absolute h-full w-full overflow-hidden z-[1] object-cover object-top top-0 left-0 fade-gradient"
      />
      <div
        class="inline-flex flex-col justify-center items-center gap-8 show-content z-[2] max-w-full"
      >
        <div
          class="inline-flex flex-col justify-center items-center gap-2 lg:w-[600px] w-[85%] max-w-full"
        >
          <ImageWithPlaceholder :src="logo" class-name="w-full" />
        </div>

        <div
          class="show-details inline-flex flex-col gap-3 bg-black/50 p-4 rounded-lg backdrop-blur-lg max-w-[90%] lg:text-[1.2em]"
        >
          <div class="inline-flex justify-between flex-wrap">
            <h1
              class="rounded-lg text-2xl font-semibold inline-flex flex-wrap gap-4"
            >
              {{ item.Name }}
              <span
                v-if="item.OriginalTitle && item.OriginalTitle != item.Name"
                class="text-white/75 font-normal"
                >{{ item.OriginalTitle }}</span
              >
            </h1>

            <div class="inline-flex gap-2 items-center justify-center">
              <Button variant="outline" size="icon" disabled>
                <PhPlay size="24" />
              </Button>
              <Button v-if="false" variant="ghost"> Movie Reel </Button>
              <Button variant="outline" size="icon" disabled>
                <PhHeart :size="24" />
              </Button>
              <Button variant="outline" size="icon" disabled>
                <PhDotsThreeVertical :size="24" weight="bold" />
              </Button>
            </div>
          </div>
          <div v-if="item.ProductionYear" class="inline-flex gap-4 w-full">
            <span>
              {{ item.ProductionYear }}
            </span>

            <div
              v-if="item.CommunityRating"
              class="stars inline-flex items-center justify-center gap-2"
            >
              <PhStar weight="fill" class="text-orange-400 lg:h-[1.25rem]" />
              <span>{{ item.CommunityRating?.toFixed(1) }}</span>
            </div>
          </div>

          <div
            class="inline-flex flex-col justify-start items-start gap-1 text-[1rem]"
          >
            <div
              id="video"
              class="inline-flex gap-4 items-center justify-center w-full"
            >
              <h3 class="text-white/75 w-[120px]">Video</h3>

              <Select>
                <SelectTrigger class="flex-grow-1">
                  <SelectValue placeholder="Placeholder text" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="'hi'">
                    {{ video }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div
              id="video"
              class="inline-flex gap-4 items-center justify-center w-full"
            >
              <h3 class="text-white/75 w-[120px]">Audio</h3>

              <Select>
                <SelectTrigger class="flex-grow-1">
                  <SelectValue placeholder="Placeholder text" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="'hi'">
                    {{ audio }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div
              id="video"
              class="inline-flex gap-4 items-center justify-center w-full"
            >
              <h3 class="text-white/75 w-[120px]">Subtitle</h3>

              <Select>
                <SelectTrigger class="flex-grow-1">
                  <SelectValue placeholder="Placeholder text" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="'hi'">
                    {{ subtitle }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p v-if="item.Overview" class="max-w-full w-[700px] overview">
            {{ item.Overview }}
          </p>

          <p v-else class="max-w-full w-[700px] overview">
            No overview provided
          </p>
          <div
            class="item-details inline-flex max-w-[800px] w-full flex-col justify-start items-start text-white/50"
          >
            <div
              v-if="item.Tags!!.length > 0"
              id="tags"
              class="inline-flex gap-1"
            >
              <p>
                <span class="text-white/75 text-lg">Tags:</span>
                {{ item.Tags?.join(", ") }}
              </p>
            </div>

            <div
              v-if="item.GenreItems!!.length > 0"
              id="genres"
              class="inline-flex justify-center items-center gap-4 text-white/75 max-w-full"
            >
              <h2 class="text-lg">Genres</h2>

              <div v-focus-section class="inline-flex gap-1 flex-wrap">
                <BrowseInternalLinkedContent
                  v-for="(genre, index) in item.GenreItems"
                  :key="index"
                  v-focus
                  :tag="genre"
                  type="genre"
                  :last="item.GenreItems!!.length - 1 == index"
                />
              </div>
            </div>

            <div
              v-if="item.Studios && item.Studios.length > 0"
              class="inline-flex justify-center items-start max-w-full gap-2"
            >
              <h2 class="text-lg text-white/75">Studios</h2>

              <div v-focus-section class="inline-flex gap-1 flex-wrap">
                <BrowseInternalLinkedContent
                  v-for="(studio, index) in item.Studios"
                  :key="index"
                  v-focus
                  :tag="studio"
                  type="studio"
                  :last="item.Studios!!.length - 1 == index"
                />
              </div>
            </div>

            <!-- <div class="inline-flex flex-col gap-2" v-if="movie.DateCreated">
                                        <h2 class="text-lg">Date Added</h2>

                                        <div class="inline-flex flex-wrap gap-[4px] text-white/50">
                                            <span>{{ movie.DateCreated }}</span>
                                        </div>
                                    </div> -->

            <div
              v-if="item.OfficialRating"
              class="inline-flex justify-center items-center max-w-full gap-4"
            >
              <h2 class="text-lg text-white/75">Audience</h2>

              <div class="inline-flex flex-">
                <span>{{ item.OfficialRating }}</span>
              </div>
            </div>

            <div
              class="inline-flex flex-wrap justify-center items-center gap-3 complete mt-3"
            >
              <Radial
                :max="100"
                :min="0"
                :value="
                  item.UserData!!.Played
                    ? 100
                    : item.UserData?.PlayedPercentage!!
                "
                class-name="size-8"
                gauge-primary-color="rgb(255, 255, 255)"
                gauge-secondary-color="rgba(0, 0, 0, 0.5)"
                :show-complete="true"
              />

              <span v-if="!item.UserData?.Played"
                >{{ item.UserData?.UnplayedItemCount }} episodes left</span
              >
              <span v-else>Completed</span>
            </div>
          </div>
        </div>
      </div>

      <slot name="sections" />
    </div>
  </div>
</template>

<style>
.fade-gradient {
  mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 30%,
    rgba(0, 0, 0, 0.2) 40%,
    rgba(0, 0, 0, 0.9) 80%,
    rgba(0, 0, 0, 0.4) 100%
  );
}
</style>
