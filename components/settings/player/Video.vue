<script setup lang="ts">
import { PhInfo } from "@phosphor-icons/vue";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import SD_480 from "~/assets/images/settings/player/video/480p.jpg";
import HD_720 from "~/assets/images/settings/player/video/720p.jpg";
import FULLHD_1080 from "~/assets/images/settings/player/video/1080p.jpg";
import ULTRAHD_4K from "~/assets/images/settings/player/video/4k.jpg";
import PIXEL3 from "~/assets/images/settings/player/video/pixel_3.jpg";

import { cn } from "~/lib/utils";

const playerStore = usePlayerStore();
const deviceStore = useDeviceStore();
const quality = ref(playerStore.settings.video.global.bitrate);

const image = ref(null as string | null);
const badConnection = ref(false);

const selectImage = (bitrate: string) => {
  switch (bitrate) {
    case "120000000":
      image.value = ULTRAHD_4K;
      playerStore.settings.video.global.height = 2160;
      break;
    case "60000000":
      image.value = FULLHD_1080;
      playerStore.settings.video.global.height = 1080;
      break;
    case "8000000":
      image.value = HD_720;
      playerStore.settings.video.global.height = 720;
      break;
    case "3000000":
      image.value = SD_480;
      playerStore.settings.video.global.height = 480;
      break;
  }

  playerStore.settings.video.global.bitrate = bitrate;
};

const autoBitrate = computed(() => deviceStore.bitrate);
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="inline-flex justify-start items-center gap-4">
        Video
        <SettingsPlayerLanguage />
      </CardTitle>
      <CardDescription
        v-if="quality != 'auto' && quality != 'display' && quality != 'source'"
      >
        <div class="video-preview mt-2">
          <h3>Preview</h3>

          <div
            class="video-wrapper w-full max-h-[520px] h-fit aspect-video bg-black rounded-lg relative"
          >
            <img
              v-if="image"
              class="h-full w-full object-cover rounded-lg"
              :src="image"
            />
          </div>
        </div>
      </CardDescription>

      <CardDescription
        v-if="quality == 'auto'"
        class="inline-flex flex-col gap-2"
      >
        <div class="inline-flex justify-center items-center gap-4 w-full">
          <div class="video-preview mt-2">
            <h3>Source</h3>

            <div
              class="video-wrapper max-h-[520px] w-full h-fit aspect-video bg-black rounded-lg relative"
            >
              <img
                class="h-full w-full object-cover rounded-lg"
                :src="FULLHD_1080"
              />
            </div>
          </div>

          <div class="inline-flex flex-col justify-center items-center">
            Connection
            <div
              id="connection"
              :class="
                cn(
                  'network-quality h-1 w-full rounded-lg animate-pulse',
                  badConnection ? 'bg-yellow-400' : 'bg-green-400',
                )
              "
            />
          </div>

          <div class="video-preview mt-2">
            <h3>Preview</h3>

            <div
              class="video-wrapper w-full max-h-[520px] h-fit aspect-video bg-black rounded-lg relative"
            >
              <img
                id="preview"
                class="h-full w-full object-cover rounded-lg"
                :src="badConnection ? PIXEL3 : FULLHD_1080"
              />
            </div>
          </div>
        </div>

        <Alert>
          <AlertTitle class="inline-flex items-center gap-2 w-full">
            <PhInfo weight="fill" class="size-4 text-blue-400" />
            Adaptive Resolution
            <div class="flex items-center space-x-2 ml-auto">
              <Switch id="bad-conn" v-model:checked="badConnection" />
              <Label for="bad-conn">Simulate Bad Connection</Label>
            </div>
          </AlertTitle>
          <AlertDescription class="mt-3 inline-flex flex-col gap-2 w-full">
            <p>
              Adaptive resolution allows content to keep playing at the cost of
              video quality.
              <br />
              Your current estimated bitrate is
              <span class="font-semibold">
                {{ (autoBitrate / 1_000_000).toFixed(2) }} MB/s
              </span>
            </p>

            <div class="flex items-center justify-between w-full">
              <Button variant="outline" @click="deviceStore.bitrateTest()">
                Test Bitrate
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </CardDescription>

      <CardDescription
        v-if="quality == 'display'"
        class="inline-flex flex-col gap-2"
      >
        <div class="video-preview mt-2">
          <h3>Preview</h3>

          <div
            class="video-wrapper w-full max-h-[520px] h-fit aspect-video bg-black rounded-lg relative"
          >
            <img
              class="h-full w-full object-cover rounded-lg"
              :src="FULLHD_1080"
            />
          </div>
        </div>

        <Alert>
          <AlertTitle class="inline-flex items-center gap-2 w-full">
            <PhInfo weight="fill" class="size-4 text-blue-400" />
            Display Resolution
          </AlertTitle>
          <AlertDescription class="mt-3 inline-flex flex-col gap-2">
            Automatically select the resolution based on your display.
          </AlertDescription>
        </Alert>
      </CardDescription>

      <CardDescription
        v-if="quality == 'source'"
        class="inline-flex flex-col gap-2"
      >
        <div class="video-preview mt-2">
          <h3>Preview</h3>

          <div
            class="video-wrapper w-full max-h-[520px] h-fit aspect-video bg-black rounded-lg relative"
          >
            <img
              class="h-full w-full object-cover rounded-lg"
              :src="ULTRAHD_4K"
            />
          </div>
        </div>

        <Alert>
          <AlertTitle class="inline-flex items-center gap-2 w-full">
            <PhInfo weight="fill" class="size-4 text-blue-400" />
            Source Resolution
          </AlertTitle>
          <AlertDescription class="mt-3 inline-flex flex-col gap-2">
            Match the resolution to be same as the source file.
          </AlertDescription>
        </Alert>
      </CardDescription>
    </CardHeader>
    <CardContent
      class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
    >
      <div class="inline-flex justify-start flex-col gap-2 items-start">
        <h2 class="text-lg">Resolution</h2>
        <Select v-model="quality" @update:model-value="selectImage">
          <SelectTrigger>
            <SelectValue value="auto" placeholder="Auto" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="auto"> Adaptive </SelectItem>
            <SelectItem value="display"> Display </SelectItem>
            <SelectItem value="source"> Source </SelectItem>
            <SelectItem value="120000000" @click="selectImage(ULTRAHD_4K)">
              4K
            </SelectItem>

            <SelectItem value="60000000" @click="selectImage(FULLHD_1080)">
              1080p
            </SelectItem>

            <SelectItem value="8000000" @click="selectImage(HD_720)">
              720p
            </SelectItem>

            <SelectItem value="3000000" @click="selectImage(SD_480)">
              480p
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>
</template>

<style>
div[part="cue-display"] {
  background-color: rgb(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  padding: 1%;
  border-radius: 0.25rem;
  opacity: 0.25;
  animation: vtt-caption-fade-in 100ms ease forwards;
  width: fit-content;
  text-align: center;
  font-size: var(--vtt-font-size);
  line-height: 1;
}

@keyframes vtt-caption-fade-in {
  0% {
    opacity: 0.25;
  }

  100% {
    opacity: 1;
  }
}
</style>
