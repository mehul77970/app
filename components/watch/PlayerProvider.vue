<script setup lang="ts">
import {
  getAudioStreams,
  getPlayerType,
  getSubtitleStreams,
  type PlayerType,
} from "@/lib/player";

const { id, startPosition, audioIndex, subtitleIndex } = defineProps<{
  id: string;
  audioIndex?: string;
  subtitleIndex?: string;
  startPosition?: number;
}>();

const playbackStore = usePlaybackStore();
const playerStore = usePlayerStore();

const startAt =
  startPosition ||
  (await playerStore.getPlayerItem(id)).UserData?.PlaybackPositionTicks ||
  0;

const playerType = ref(null as PlayerType | null);

console.log("loading playback info with id", id);

const info = await playbackStore.getPlaybackInfo(id, {
  audioIndex: Number(audioIndex),
  subtitleIndex: Number(subtitleIndex),
});

playbackStore.setPlaybackInfo(info);

playerType.value = getPlayerType(info);

await playerStore.getPlayerItem(id);

playerStore.getDefaultMediaStreams(info);

onMounted(async () => {
  console.log("Audio", audioIndex, "Subtitle", subtitleIndex);

  console.log("PlayerProvider: Got Playback info", info);

  if (audioIndex) {
    const audio = getAudioStreams(info).find(
      (a) => a.source?.Index === Number(audioIndex),
    );

    if (!audio) return;

    playerStore.audio = audio;
  }

  if (subtitleIndex) {
    const subtitle = getSubtitleStreams(info).find(
      (s) => s.source?.Index === Number(subtitleIndex),
    );

    if (!subtitle) return;

    playerStore.subtitle = subtitle;
  }
});

onUnmounted(() => {
  playerStore.subtitle = null;
  playerStore.audio = null;
  playerStore.video = null;

  playbackStore.info = null;
  playbackStore._transcodingUrl = null;
});

const debug = computed(() => playerStore.debug.enabled);
</script>

<template>
  <div
    id="player-wrapper"
    class="w-full h-[100vh] max-w-full inline-flex flex-col justify-center items-center relative select-none overflow-hidden bg-black"
  >
    <div v-if="!playerType">
      <h1>No compatiable player found.</h1>
    </div>

    <!-- HLS Player -->
    <LazyWatchHLSPlayer
      v-if="playerType === 'hls'"
      :id
      :video-index="0"
      :audio-index="Number(audioIndex)"
      :subtitle-index="Number(subtitleIndex)"
      :start-position="startAt"
      class="flex-gro"
    />

    <!-- Debug window -->
    <WatchDebug v-if="debug" />

    <!-- HTTP player -->
    <LazyWatchHTTPPlayer v-if="playerType === 'http'" />

    <!-- Native player, only avaliable for desktop! -->
    <LazyWatchNativePlayer
      v-if="playerType === 'native'"
      :start-position="startAt"
    />

    <!-- Player controls -->
    <WatchControlsProvider :id />
  </div>
</template>
