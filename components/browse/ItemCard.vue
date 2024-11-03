<script setup lang="ts">
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { formatDate } from "@/lib/utils";
import GlobalImageWithPlaceholder from "@/components/global/ImageWithPlaceholder.vue";

const { item, customOriginalName, hdr, channelLayout, videoResolution } =
  defineProps<{
    item: BaseItemDto;
    customOriginalName?: string;
    hdr?: string;
    channelLayout?: string;
    videoResolution?: string;
  }>();

// const videoCodecs = [] as string[];
// const videoContainers = [] as string[];
const mediaBrowser = useMediaBrowserStore();

// const getTotalMediaSize = () => {
//     let size = 0;
//     for (let i = 0; item.MediaSources.length > i; i++) {
//         const source = item.MediaSources[i];

//         if (source.Size) {
//             size += source.Size;
//         }
//     }

//     return size;
// }

// const canPlayVideoDirectly = () => {
//     for (let i = 0; item.MediaSources.length > i; i++) {
//         const source = item.MediaSources[i];

//         if (source.MediaStreams) {
//             const videoStreams = source.MediaStreams.filter(stream => stream.Type == 'Video');

//             videoContainers.push(source.Container!!);
//             videoStreams.forEach(stream => {
//                 videoCodecs.push(stream.Codec!!);
//             })
//         }
//     }
// }

// canPlayVideoDirectly();

// onMounted(() => {
//     const tempVideoElement = document.createElement('video');

//     console.log(Boolean(tempVideoElement.canPlayType(`video/mp4;codecs="mp4a.40.2"`)))
// });

// TODO: Make a util func
const seasonHasImage = (season: BaseItemDto) => {
  return Boolean(season?.ImageTags?.["Primary"]);
};
</script>

<template>
  <div
    class="item-card inline-flex flex-col gap-8 sm:w-[600px] max-w-full h-fit"
  >
    <div class="title inline-flex flex-col gap-2">
      <span v-if="item.Name" class="text-4xl font-bold name-transition">
        {{ item.Name }}
      </span>

      <h2
        v-if="!customOriginalName && item.OriginalTitle !== item.Name"
        class="text-2xl text-white/85"
      >
        {{ item.OriginalTitle }}
      </h2>

      <h2 v-else-if="customOriginalName" class="text-2xl text-white/85">
        {{ customOriginalName }}
      </h2>
    </div>

    <GlobalImageWithPlaceholder
      v-if="seasonHasImage(item)"
      :src="mediaBrowser.generateImageURL(item.Id!!)"
      class-name="item-image rounded-lg bg-gray-600 shadow-black shadow-2xl object-contain image-fade"
    />

    <img
      v-else
      class="item-image rounded-lg bg-gray-600 shadow-black shadow-2xl object-cover image-fade"
      src="/placeholder.svg"
    />

    <div class="inline-flex flex-wrap gap-1">
      <div
        v-if="videoResolution"
        class="hdr-badge py-1 px-2 rounded-md bg-white/25"
      >
        <span class="text-white/50 font-semibold">{{ videoResolution }}</span>
      </div>

      <div v-if="hdr" class="hdr-badge py-1 px-2 rounded-md bg-white/25">
        <span class="text-white/50 font-semibold">{{ hdr }}</span>
      </div>

      <div
        v-if="channelLayout"
        class="hdr-badge py-1 px-2 rounded-md bg-white/25"
      >
        <span class="text-white/50 font-semibold">{{ channelLayout }}</span>
      </div>
    </div>

    <div class="item-details inline-flex flex-col gap-4">
      <div
        v-if="item.GenreItems!!.length > 0"
        id="genres"
        class="inline-flex flex-col text-white/75 max-w-full"
      >
        <h2 class="text-lg">Genres</h2>

        <div class="inline-flex flex-wrap gap-1">
          <BrowseInternalLinkedContent
            v-for="(genre, index) in item.GenreItems"
            :key="index"
            :tag="genre"
            type="genre"
            :last="item.GenreItems!!.length - 1 == index"
          />
        </div>
      </div>

      <!-- TODO: Use linked version -->
      <div
        v-if="item.Tags!!.length > 0"
        id="tags"
        class="inline-flex flex-col text-white/75 max-w-full"
      >
        <h2 class="text-lg">Tags</h2>

        <div class="inline-flex flex-wrap text-white/50">
          <span>{{ item.Tags?.join(", ") }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-2 text-white/75">
        <div class="inline-flex flex-wrap gap-8">
          <div
            v-if="item.CommunityRating"
            class="rating inline-flex flex-col gap-2"
          >
            <h2 class="text-lg">Rating</h2>

            <div class="inline-flex flex-wrap gap-[4px] text-white/50">
              <BrowseRating :rating="item.CommunityRating" />
            </div>
          </div>

          <div v-if="item.PremiereDate" class="inline-flex flex-col gap-2">
            <h2 class="text-lg">Released</h2>

            <div class="inline-flex flex-wrap gap-[4px] text-white/50">
              <span>{{ formatDate(item.PremiereDate) }}</span>
            </div>
          </div>

          <!-- TODO: Use linked version -->
          <div
            v-if="item.Studios && item.Studios.length > 0"
            class="inline-flex flex-col gap-2"
          >
            <h2 class="text-lg">Studios</h2>

            <div
              class="inline-flex gap-[4px] flex-wrap text-lg text-white/50 max-w-full break-words"
            >
              <BrowseInternalLinkedContent
                v-for="(studio, index) in item.Studios"
                :key="index"
                :tag="studio"
                type="studio"
                :last="item.Studios!!.length - 1 == index"
              />
            </div>
          </div>

          <div v-if="item.DateCreated" class="inline-flex flex-col gap-2">
            <h2 class="text-lg">Date Added</h2>

            <div class="inline-flex flex-wrap gap-[4px] text-white/50">
              <span>{{ formatDate(item.DateCreated) }}</span>
            </div>
          </div>

          <div v-if="item.OfficialRating" class="inline-flex flex-col gap-2">
            <h2 class="text-lg">Audience</h2>

            <div class="inline-flex flex-wrap gap-[4px] text-white/50">
              <span>{{ item.OfficialRating }}</span>
            </div>
          </div>

          <!-- TODO: Add debug info
                     <div class="inline-flex flex-col gap-2">
                        <h2 class="text-lg">Source Size</h2>

                        <div class="inline-flex gap-[4px] flex-wrap text-lg text-white/50 max-w-full break-words">

                            {{ getHumanReadableSize(getTotalMediaSize(), true) }}
                        </div>
                    </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
