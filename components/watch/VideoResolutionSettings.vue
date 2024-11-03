<script setup lang="ts">
import type HLS from "hls.js";

import { PhSlidersHorizontal } from "@phosphor-icons/vue";

import type { MediaStream } from "@jellyfin/sdk/lib/generated-client";
import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

const { videoID, player, stream, defaultVideoSource, video } = defineProps<{
  videoID: string;
  player: HLS;

  stream: {
    audio: string;
    video: string;
    subtitle: string;
  };
  defaultVideoSource: MediaStream;
  video: HTMLMediaElement;
}>();

const playback = usePlaybackStore();

const activeResolution = defineModel<number>("activeResolution", {
  default: 0,
});

const videoResolutionGreaterThan = (res: number) => {
  if (defaultVideoSource.Width! >= res) return true;
  return false;
};

const changeVideoResolution = async (bitrate: number, res: number) => {
  if (activeResolution.value == res) return;
  activeResolution.value = res;

  player.stopLoad();
  playback.stopPlaybackTranscode();

  const info = await playback.getPlaybackInfo(
    videoID,
    undefined,
    undefined,
    undefined,
    bitrate,
  );

  playback.setPlaybackInfo(info);
  playback.setPlaybackHeightAndWidth(res);
  playback.setPlaybackAudioIndex(stream.audio);
  playback.setPlaybackVideoIndex(stream.video);
  playback.setPlaybackSubtitleIndex(stream.subtitle);

  // const playerPosition = video.currentTime

  player.loadSource(playback.transcodingUrl);
  player.startLoad(video.currentTime);

  // video.currentTime = playerPosition
};
</script>

<template>
  <DropdownMenuSub>
    <DropdownMenuSubTrigger>
      <PhSlidersHorizontal :size="24" weight="fill" />
      <span class="ml-2">Quality</span>
    </DropdownMenuSubTrigger>

    <DropdownMenuPortal>
      <DropdownMenuSubContent>
        <DropdownMenuCheckboxItem
          v-if="videoResolutionGreaterThan(3840)"
          :checked="activeResolution == 3840"
          @select="changeVideoResolution(25000000, 3840)"
        >
          <span>4K</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          v-if="videoResolutionGreaterThan(2560)"
          :checked="activeResolution == 2560"
          @select="changeVideoResolution(10000000, 2560)"
        >
          <span>1440p</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          v-if="videoResolutionGreaterThan(1920)"
          :checked="activeResolution == 1920"
          @select="changeVideoResolution(6000000, 1920)"
        >
          <span>1080p</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          v-if="videoResolutionGreaterThan(720)"
          :checked="activeResolution == 720"
          @select="changeVideoResolution(4500000, 720)"
        >
          <span>720p</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          v-if="videoResolutionGreaterThan(640)"
          :checked="activeResolution == 640"
          @select="changeVideoResolution(2500000, 480)"
        >
          <span>480p</span>
        </DropdownMenuCheckboxItem>
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
</template>
