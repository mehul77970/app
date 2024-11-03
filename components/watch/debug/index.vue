<script setup lang="ts">
import { PhInfo } from '@phosphor-icons/vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { truncate } from '~/lib/utils'

const playerStore = usePlayerStore()
const { hideControls, loaded, seeking, loading, paused, volume, muted, pictureInPicture, fullscreen, position, positionTimeline, buffer, video, audio, subtitle, subtitleTimeSyncOffset, item, debug } = storeToRefs(playerStore)

const refreshRequired = ref(false)

const toggleHLSDebug = () => {
  debug.value.hls = !debug.value.hls
  refreshRequired.value = true
}
</script>

<template>
  <Card
    class="absolute right-8 left-8 lg:left-auto top-auto max-h-[90%] min-w-[40%] bottom-auto z-[55] lg:max-w-[55%] max-w-[100%]"
  >
    <CardHeader>
      <CardTitle>Player Debug</CardTitle>
      <CardDescription>Provides details for debugging player issues.</CardDescription>
    </CardHeader>
    <CardContent class="inline-flex flex-col text-muted-foreground select-text overflow-y-auto h-[500px] w-full">
      <h3 class="w-full font-semibold text-lg text-foreground">
        Store
      </h3>
      <div class="inline-flex flex-wrap gap-2 break-al">
        <span>Controls:</span>
        {{ hideControls ? 'hidden' : 'visible' }}
      </div>
      <div class="inline-flex flex-wrap gap-2 break-al">
        <span>Loaded:</span>
        {{ loaded }}
      </div>
      <div class="inline-flex flex-wrap gap-2 break-al">
        <span>Seek State:</span>
        {{ seeking }}
      </div>
      <div class="inline-flex flex-wrap gap-2 break-al">
        <span>Loading:</span>
        {{ loading }}
      </div>
      <div class="inline-flex flex-wrap gap-2 break-al">
        <span>Paused:</span>
        {{ paused }}
      </div>
      <div class="inline-flex flex-wrap gap-2 break-al">
        <span>Volume:</span>
        {{ volume }}
        Muted: {{ muted }}
      </div>
      <div class="inline-flex flex-wrap gap-2 break-al">
        <span>PiP:</span>
        {{ pictureInPicture }}
      </div>
      <div class="inline-flex flex-wrap gap-2 break-al">
        <span>Fullscreen:</span>
        {{ fullscreen }}
      </div>
      <div class="inline-flex flex-wrap gap-2 break-al">
        <span>Position:</span>
        {{ position }}
        Timeline: {{ positionTimeline }}
      </div>
      <div class="inline-flex flex-wrap gap-2 break-al">
        <span>Buffer:</span>
        {{ buffer }}
      </div>
      <h3 class="w-full font-semibold text-lg text-foreground">
        Tracks
      </h3>
      <div
        v-if="video"
        class="inline-flex flex-wrap gap-2 break-al"
      >
        <span>Video:</span>
        {{ video.title }}
        Dolby: {{ video.dolbyDigital }} HDR: {{ video.hdr }}
      </div>
      <div
        v-if="audio"
        class="inline-flex flex-wrap gap-2 break-al"
      >
        <span>Audio:</span>
        {{ audio.title }}
        Dolby: {{ audio.dolbyAudio }} DTS: {{ audio.dtsAudio }}
      </div>
      <div
        v-if="subtitle"
        class="inline-flex flex-wrap gap-2 break-al"
      >
        <span>Subtitle:</span>
        {{ subtitle.title }}
        Offset: {{ subtitleTimeSyncOffset }}
      </div>

      <h3 class="w-full font-semibold text-lg text-foreground">
        Source
      </h3>
      <div
        v-if="item"
        class="inline-flex flex-wrap gap-2 break-all"
      >
        <span>Title:</span>
        {{ item.Name }} (ID: {{ item.Id }})
      </div>

      <Alert class="mt-3 w-full">
        <AlertTitle class="inline-flex flex-wrap gap-2 items-center justify-between w-full">
          <span class="inline-flex items-center gap-2">
            <PhInfo
              weight="fill"
              class="size-6 text-yellow-400"
            />
            Warning
          </span>

          <Button
            v-if="debug.hls"
            class="w-fit"
            variant="secondary"
            @click="toggleHLSDebug"
          >
            Disable HLS debug logging
          </Button>
          <Button
            v-else
            class="w-fit"
            variant="destructive"
            @click="toggleHLSDebug"
          >
            Enable HLS debug logging
          </Button>
        </AlertTitle>
        <AlertDescription class="inline-flex flex-col gap-2 max-w-full max-h-full overflow-y-auto">
          Running HLS in debug mode can affect player performance
          <span v-if="refreshRequired">Refresh is required for changes to take affect</span>

          <div class="inline-flex flex-col max-w-full">
            <h4>Logs</h4>
            <div v-if="debug.hls">
              <p
                v-for="(log, index) in debug.data.logs"
                :key="index"
                class="break-all mb-2"
              >
                <span
                  v-if="log.type == 'log'"
                  class="p-1 text-foreground/50 font-semibold"
                >DEBUG</span>
                <span
                  v-if="log.type == 'warn'"
                  class="p-1 text-yellow-400 font-semibold"
                >WARN</span>
                <span
                  v-if="log.type == 'info'"
                  class="p-1 text-blue-400 font-semibold"
                >INFO</span>
                <span
                  v-if="log.type == 'error'"
                  class="p-1 text-red-400 font-semibold"
                >ERROR</span>

                {{ log.message }}

                (Params: {{ truncate(JSON.stringify(log.optionalParams), {
                  length: 60,
                  position:
                    'middle' }) }})
              </p>
            </div>

            <span
              v-else
              class="text-red-400"
            >Not Enabled</span>
          </div>
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
</template>
