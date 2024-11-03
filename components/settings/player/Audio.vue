<script setup lang="ts">
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

const quality = ref("auto");
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="inline-flex justify-start items-center gap-4">
        Audio
        <SettingsPlayerLanguage />
      </CardTitle>
      <CardDescription>
        <!-- <div class="video-preview mt-2">
                    <h3>Preview</h3>

                    <div class="video-wrapper w-full h-fit aspect-video bg-black rounded-lg relative">
                        <video class="h-full w-full object-cover rounded-lg" id="video" poster="/placeholder.svg"></video>

                        <div ref="vttCaptionElement" class="bottom-[10%] w-full overflow-hidden absolute text-xl inline-flex flex-col gap-2 justify-center items-center">
                        </div>
                        <div id="ass-container"></div>
                    </div>
                </div> -->
      </CardDescription>
    </CardHeader>
    <CardContent
      class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
    >
      <div class="inline-flex justify-start flex-col gap-2 items-start">
        <h2 class="text-lg">Max Channels</h2>
        <Select v-model="quality">
          <SelectTrigger>
            <SelectValue value="auto" placeholder="Auto" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="auto"> Auto </SelectItem>
            <SelectItem value="display"> Same as Display </SelectItem>
            <SelectItem value="source"> Source </SelectItem>
            <SelectItem value="120000000"> 4K - 120 Mbps </SelectItem>
            <SelectItem value="80000000"> 4K - 80 Mbps </SelectItem>
            <SelectItem value="60000000"> 1080p - 60 Mbps </SelectItem>
            <SelectItem value="40000000"> 1080p - 40 Mbps </SelectItem>
            <SelectItem value="20000000"> 1080p - 20 Mbps </SelectItem>
            <SelectItem value="1500000"> 1080p - 15 Mbps </SelectItem>
            <SelectItem value="1000000"> 1080p - 10 Mbps </SelectItem>
            <SelectItem value="8000000"> 720p - 8 Mbps </SelectItem>
            <SelectItem value="6000000"> 720p - 6 Mbps </SelectItem>
            <SelectItem value="4000000"> 720p - 4 Mbps </SelectItem>
            <SelectItem value="3000000"> 480p - 3 Mbps </SelectItem>
            <SelectItem value="15000"> 480p - 1.5 Mbps </SelectItem>
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
