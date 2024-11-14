<script setup lang="ts">
import { CaptionsRenderer, parseText } from "media-captions";
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
import ASS from "@/lib/subtitles/ass";

const assText = `[Script Info]
Title:
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 640
PlayResY: 480
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,0
Style: Alt,Times New Roman,40,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,8,10,10,10,0

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Comment: 0,0:00:00.00,0:00:05.00,Default,,0000,0000,0000,,This line is a comment and should not display on rendered output. This file is intended to be rendered on a 640x480 video, preferably a single solid colour, or maybe a checkerboard pattern.
Dialogue: 0,0:00:00.00,0:00:05.00,Default,,0000,0000,0000,,This is an example of the ASS subtitle format
`;

const vttText = `
WEBVTT - Example Title

00:00:00.00 --> 00:00:05.00 align:middle
This is an example vtt/srt subtitle.
`;
const vttSubsData = await parseText(vttText);

type ResampleConfig =
  | "video_height"
  | "video_height"
  | "video_width"
  | "script_height"
  | "script_width";

const resampling = ref("video_height" as ResampleConfig);
const scaling = ref([100]);
const vttCaptionElement = ref(null as null | HTMLElement);

let assPlayer: undefined | ASS;
let vttPlayer: undefined | CaptionsRenderer;

onMounted(() => {
  createAssPlayer();
  createVTTPlayer();
});

onUnmounted(() => {
  destroyAssPlayer();
});

function createAssPlayer(resample: ResampleConfig = "video_width") {
  assPlayer = new ASS(
    assText,
    document.getElementById("video")! as HTMLVideoElement,
    {
      resampling: resample,
      container: document.getElementById("ass-container")!,
    },
  );
}

function createVTTPlayer() {
  if (!vttCaptionElement.value) return;

  vttPlayer = new CaptionsRenderer(vttCaptionElement.value!);

  vttPlayer.changeTrack(vttSubsData);
}
function destroyAssPlayer() {
  if (!assPlayer) return;
  assPlayer.destroy();
  assPlayer = undefined;
}

function onScaleDrag(scale: number[] | undefined) {
  if (!scale || !scale[0]) return;

  vttCaptionElement.value!.style.setProperty("--vtt-font-size", `${scale[0]}%`);
  // createAssPlayer(scale[0]);
}

function onResamplePicked(sample: string) {
  destroyAssPlayer();
  createAssPlayer(sample as ResampleConfig);
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="inline-flex justify-start items-center gap-4">
        Subtitles
        <SettingsPlayerLanguage />
      </CardTitle>
      <CardDescription>
        <div class="video-preview mt-2">
          <h3>Preview</h3>

          <div
            class="video-wrapper w-full h-fit aspect-video bg-black rounded-lg relative"
          >
            <video
              id="video"
              class="h-full w-full object-cover rounded-lg"
              poster="/placeholder.svg"
            />

            <div
              ref="vttCaptionElement"
              class="bottom-[10%] w-full overflow-hidden absolute text-xl inline-flex flex-col gap-2 justify-center items-center"
            />
            <div id="ass-container" />
          </div>
        </div>
      </CardDescription>
    </CardHeader>
    <CardContent
      class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
    >
      <div class="inline-flex justify-start flex-col gap-2 items-start">
        <h2 class="text-xl font-semibold">Resampling (ASS)</h2>
        <Select v-model="resampling" @update:model-value="onResamplePicked">
          <SelectTrigger>
            <SelectValue value="video_height" placeholder="Video Height" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="video_height"> Video Height </SelectItem>
            <SelectItem value="video_width"> Video Width </SelectItem>
            <SelectItem value="script_height"> Script Height </SelectItem>
            <SelectItem value="script_width"> Script Width </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="inline-flex justify-start flex-col gap-2 items-start">
        <h2 class="text-xl font-semibold">Scaling (SRT/VTT)</h2>
        <Slider
          v-model="scaling"
          :min="1"
          :max="500"
          :step="0.1"
          class="w-full"
          @update:model-value="onScaleDrag"
        />
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
