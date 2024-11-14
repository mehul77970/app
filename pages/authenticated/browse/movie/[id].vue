<script setup lang="ts">
import { PhStar } from "@phosphor-icons/vue";
import ms from "ms";
import { animate, stagger } from "motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAudioSource,
  createSubtitleSource,
  createVideoSource,
  getDefaultMediaStreams,
} from "@/lib/player";

definePageMeta({ layout: "authenticated" });

const bgImage = ref(null as null | HTMLImageElement);
const route = useRoute();
const mediaBrowser = useMediaBrowserStore();

onMounted(() => {
  const controller = animate([
    [
      ".stagger",
      { opacity: 1, x: [-20, 0] },
      { duration: 0.2, delay: stagger(0.02) },
    ],
  ]);

  console.log("Controller", controller);
  const eventHandler = () => requestAnimationFrame(calculateParallax);

  function calculateParallax() {
    const containerRect = bgImage.value!.getBoundingClientRect();

    const viewportOffsetTop = containerRect.top;
    const viewportOffsetBottom = window.innerHeight - viewportOffsetTop;

    scrollFactor.value =
      viewportOffsetBottom / (window.innerHeight + containerRect.height);

    offset.value = scrollFactor.value * containerRect.height * 0.25;
  }

  addComponentEventListener(window, "scroll", () => eventHandler());

  eventHandler();
});

const movie = await mediaBrowser.getItem(route.params.id! as string);

const defaultSources = getDefaultMediaStreams(movie);

const audioSources = movie.MediaStreams
  ? movie.MediaStreams.filter((s) => s.Type === "Audio").map((s) =>
      createAudioSource(s),
    )
  : [];
const defaultAudioSource = defaultSources.audio;

const videoSources = movie.MediaStreams
  ? movie.MediaStreams.filter((s) => s.Type === "Video").map((s) =>
      createVideoSource(s),
    )
  : [];
const defaultVideoSource = defaultSources.video;

const subtitleSources = movie.MediaStreams
  ? movie.MediaStreams.filter((s) => s.Type === "Subtitle").map((s) =>
      createSubtitleSource(s),
    )
  : [];
const defaultSubtitleSource = defaultSources.subtitle;

const selectedAudioTrack = ref(defaultAudioSource?.source?.Index?.toString());
const selectedVideoTrack = ref(defaultVideoSource?.source?.Index?.toString());
const selectedSubtitleTrack = ref(
  defaultSubtitleSource?.source?.Index?.toString(),
);

const scrollFactor = ref(0);
const offset = ref(0);

function getEndsAtTime() {
  if (!movie.RunTimeTicks) return;
  if (!movie.UserData?.PlaybackPositionTicks) return;

  const runtimeMs = movie.RunTimeTicks / 10000;
  const playerMs = movie.UserData?.PlaybackPositionTicks;

  const millisecondsLeft = movie.UserData?.PlaybackPositionTicks
    ? runtimeMs - playerMs
    : runtimeMs;

  return new Intl.DateTimeFormat("default", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(Date.now() + millisecondsLeft));
}
</script>

<template>
  <div class="hide-scroll">
    <img
      class="absolute h-full w-full overflow-hidden blur-sm fade-bg object-cover object-top top-0 left-0 fade-gradient"
      height="100%"
      width="100%"
      :src="mediaBrowser.generateImageURL(movie.Id!!, 'Backdrop/0')"
    />
    <div class="inline-flex justify-around mt-[72px]">
      <div class="inline-flex flex-wrap w-full justify-center mt-8">
        <div
          class="elements grid md:grid-cols-2 gap-16 p-8 max-w-full w-full flex-wrap lg:justify-start justify-center"
        >
          <img
            :src="mediaBrowser.generateImageURL(movie.Id!!)"
            class="w-auto h-fit max-h-[80vh] rounded-lg z-[2] stagger"
          />
          <div
            id="content"
            class="content mt-[30px] inline-flex flex-col z-[2] h-fit"
          >
            <LazyBrowseLogo :item="movie" class="w-[500px] mb-24 stagger" />
            <div class="title inline-flex flex-col gap-1">
              <span
                v-if="movie.Name"
                class="text-4xl font-bold name-transition stagger"
              >
                {{ movie.Name }}
              </span>

              <h2 class="text-2xl text-white/85 stagger">
                {{ movie.OriginalTitle }}
              </h2>

              <div class="short-list-details inline-flex gap-3 stagger">
                <span>
                  {{ movie.ProductionYear }}
                </span>

                <span class="stagger">
                  {{ ms(movie?.RunTimeTicks || 0 / 10000) }}
                </span>

                <div
                  class="stars inline-flex items-center justify-center gap-2 stagger"
                >
                  <PhStar :size="18" weight="fill" class="text-orange-400" />
                  <span>{{ movie.CommunityRating?.toFixed(1) }}</span>
                </div>

                <span class="stagger"> Ends at {{ getEndsAtTime() }} </span>
              </div>
              <div
                class="inline-flex flex-col w-fit lg:max-w-[1200px] max-w-[600px] gap-4 mt-8"
              >
                <div class="flex flex-col gap-2">
                  <div
                    v-if="defaultVideoSource"
                    class="inline-flex justify-center items-center"
                  >
                    <h3 class="text-white/75 w-[120px]">Video</h3>

                    <Select v-model="selectedVideoTrack">
                      <SelectTrigger>
                        <SelectValue
                          :placeholder="
                            defaultVideoSource
                              ? defaultVideoSource.title
                              : 'None'
                          "
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="(video, index) in videoSources"
                          :key="index"
                          :value="video?.source?.Index?.toString() || ''"
                        >
                          <TextVideoWithFeatures v-if="video" :video="video" />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div
                    v-if="defaultAudioSource"
                    class="inline-flex justify-center items-center"
                  >
                    <h3 class="text-white/75 w-[120px]">Audio</h3>

                    <Select v-model="selectedAudioTrack">
                      <SelectTrigger>
                        <SelectValue
                          :placeholder="
                            defaultAudioSource
                              ? defaultAudioSource.title
                              : 'None'
                          "
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="(audio, index) in audioSources"
                          :key="index"
                          :value="audio?.source?.Index?.toString() || '0'"
                        >
                          <TextAudioWithFeatures v-if="audio" :audio="audio" />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div
                    v-if="defaultSubtitleSource"
                    class="inline-flex justify-center items-center"
                  >
                    <h3 class="text-white/75 w-[120px]">Subtitles</h3>

                    <Select v-model="selectedSubtitleTrack">
                      <SelectTrigger>
                        <SelectValue
                          :placeholder="
                            defaultSubtitleSource
                              ? defaultSubtitleSource?.title
                              : 'None'
                          "
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="(subtitle, index) in subtitleSources"
                          :key="index"
                          :value="subtitle?.source?.Index?.toString() || ''"
                        >
                          {{ subtitle?.title }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div class="inline-flex flex-col gap-1">
                  <h2 class="text-white/75">Overview</h2>
                  <p id="overview" class="break-words lg:text-xl">
                    {{ movie.Overview }}
                  </p>
                </div>

                <template v-if="movie.UserData?.PlaybackPositionTicks !== 0">
                  <h2 class="text-xl font-semibold">Continue Watching</h2>

                  <VideoPreview
                    :item="movie"
                    :audio-index="Number(selectedAudioTrack)"
                    :video-index="Number(selectedVideoTrack)"
                    :subtitle-index="Number(selectedSubtitleTrack)"
                    class="max-h-full lg:max-w-[550px]flex justify-center items-center aspect-auto sm:aspect-video sm:w-auto w-full"
                  />
                </template>

                <template v-else>
                  <h2 class="text-xl font-semibold">Start Watching</h2>

                  <VideoPreview
                    :item="movie"
                    :audio-index="Number(selectedAudioTrack)"
                    :video-index="Number(selectedVideoTrack)"
                    :subtitle-index="Number(selectedSubtitleTrack)"
                    class="max-h-full lg:max-w-[550px] flex justify-center items-center aspect-auto sm:aspect-video sm:w-auto w-full"
                    :show-progress="false"
                  />
                </template>

                <div
                  class="item-details inline-flex max-w-[800px] w-full gap-4 flex-col justify-start items-start text-white/50"
                >
                  <div
                    v-if="movie.Tags!!.length > 0"
                    id="tags"
                    class="inline-flex gap-1"
                  >
                    <p>
                      <span class="text-white/75">Tags:</span>
                      {{ movie.Tags?.join(", ") }}
                    </p>
                  </div>

                  <div
                    v-if="movie.GenreItems!!.length > 0"
                    id="genres"
                    class="inline-flex justify-center items-center gap-4 text-white/75 max-w-full"
                  >
                    <h2 class="text-lg">Genres</h2>

                    <div class="inline-flex gap-1 flex-wrap">
                      <BrowseInternalLinkedContent
                        v-for="(genre, index) in movie.GenreItems"
                        :key="index"
                        :tag="genre"
                        type="genre"
                        :last="movie.GenreItems!!.length - 1 == index"
                      />
                    </div>
                  </div>

                  <!-- TODO: Use linked version -->

                  <!-- TODO: Use linked version -->
                  <div
                    v-if="movie.Studios && movie.Studios.length > 0"
                    class="inline-flex justify-center items-start max-w-full gap-4"
                  >
                    <h2 class="text-lg text-white/75">Studios</h2>

                    <div class="inline-flex gap-1 flex-wrap">
                      <BrowseInternalLinkedContent
                        v-for="(studio, index) in movie.Studios"
                        :key="index"
                        :tag="studio"
                        type="studio"
                        :last="movie.Studios!!.length - 1 === index"
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
                    v-if="movie.OfficialRating"
                    class="inline-flex justify-center items-center max-w-full gap-4"
                  >
                    <h2 class="text-lg text-white/75">Audience</h2>

                    <div class="inline-flex flex-">
                      <span>{{ movie.OfficialRating }}</span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-bg {
  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

.stagger,
.stagger-up {
  opacity: 0;
}
</style>
