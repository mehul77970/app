<script lang="ts" setup>
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'
import { PhClosedCaptioning, PhFilmReel } from '@phosphor-icons/vue'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { getSubtitleStreams, VideoBitrate, VideoResolution } from '~/lib/player'

const { item } = defineProps<{
  item: BaseItemDto
}>()
const playerStore = usePlayerStore()

const options = {
  4: {
    2: 120,
    1: 80,
    0: 40,
  },
  3: {
    2: 40,
    1: 30,
    0: 20,
  },
  2: {
    2: 20,
    1: 15,
    0: 10,
  },
  1: {
    2: 10,
    1: 5,
    0: 3,
  },
  0: {
    2: 5,
    1: 3,
    0: 2,
  },
}

const videoQuality = computed(() => playerStore.settings.video_new)

const changeBitrate = (bitrate: VideoBitrate) => {
  const bitrateNumber = options[videoQuality.value.resolution][bitrate]

  playerStore.setVideoQuality({ resolution: videoQuality.value.resolution, bitrate: bitrate }, bitrateNumber)
}

const changeResolution = (video: VideoResolution) => {
  const bitrateNumber = options[videoQuality.value.resolution][videoQuality.value.bitrate.type]
  playerStore.setVideoQuality({ resolution: video, bitrate: videoQuality.value.bitrate.type }, bitrateNumber)
}
</script>

<template>
  <DropdownMenuSub>
    <DropdownMenuSubTrigger>
      <div class="inline-flex gap-2 justify-start items-center">
        <PhFilmReel
          :size="18"
          weight="fill"
        />
        <span>Video</span>
      </div>
    </DropdownMenuSubTrigger>

    <DropdownMenuPortal>
      <DropdownMenuSubContent class="inline-flex flex-col">
        <!-- <DropdownMenuLabel>
          Preset
        </DropdownMenuLabel>
        <DropdownMenuCheckboxItem>
          Adaptive
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>
          Display
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>
          Source
        </DropdownMenuCheckboxItem>
        <SelectSeparator /> -->
        <DropdownMenuLabel>
          Bitrate
        </DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          :checked="videoQuality.bitrate.type === VideoBitrate.HIGH"
          @click="changeBitrate(VideoBitrate.HIGH)"
        >
          High
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          :checked="videoQuality.bitrate.type === VideoBitrate.MEDIUM"
          @click="changeBitrate(VideoBitrate.MEDIUM)"
        >
          Medium
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          :checked="videoQuality.bitrate.type === VideoBitrate.LOW"
          @click="changeBitrate(VideoBitrate.LOW)"
        >
          Low
        </DropdownMenuCheckboxItem>
        <SelectSeparator />
        <DropdownMenuLabel>
          Resolution
        </DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          :checked="videoQuality.resolution === VideoResolution.ULTRA_HD"
          :disabled="!playerStore.isResolutionSupported(VideoResolution.ULTRA_HD)"
          @click="changeResolution(VideoResolution.ULTRA_HD)"
        >
          2160p
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          :checked="videoQuality.resolution === VideoResolution.QUAD_HD"
          :disabled="!playerStore.isResolutionSupported(VideoResolution.QUAD_HD)"
          @click="changeResolution(VideoResolution.QUAD_HD)"
        >
          1440p
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          :checked="videoQuality.resolution === VideoResolution.FULL_HD"
          :disabled="!playerStore.isResolutionSupported(VideoResolution.FULL_HD)"
          @click="changeResolution(VideoResolution.FULL_HD)"
        >
          1080p
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          :checked="videoQuality.resolution === VideoResolution.HD"
          :disabled="!playerStore.isResolutionSupported(VideoResolution.HD)"
          @click="changeResolution(VideoResolution.HD)"
        >
          720p
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          :checked="videoQuality.resolution === VideoResolution.SD"
          :disabled="!playerStore.isResolutionSupported(VideoResolution.SD)"
          @click="changeResolution(VideoResolution.SD)"
        >
          480p
        </DropdownMenuCheckboxItem>

        <!-- <DropdownMenuCheckboxItem
          v-for="subtitle in subtitleSources"
          :key="subtitle?.source?.Index"
          :checked="subtitle?.source?.Index === selectedSubtitle?.source?.Index"
          @click="changeSubtitle(subtitle)"
        >
          {{ subtitle.title }}
        </DropdownMenuCheckboxItem> -->
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
</template>
