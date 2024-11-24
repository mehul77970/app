<script setup lang="ts">
import { PhSpeakerX } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const playerStore = usePlayerStore()

const _internalVolume = ref([100])

const muted = computed(() => playerStore.muted)
const volume = computed(() => playerStore.volume)

function changeVolume(volume: number[] | undefined) {
  if (!volume) return

  playerStore.volume = volume[0]
}

function toggleMute() {
  playerStore.muted = !playerStore.muted
}
</script>

<template>
  <!-- Player Mute Toggle -->

  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          class="selectable"
          size="icon"
          @click="toggleMute"
        >
          <WatchVolumeIndicators
            v-if="!muted"
            :volume="volume"
          />

          <PhSpeakerX
            v-else
            size="24"
            weight="duotone"
          />
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <div
          class="inline-flex justify-center items-center gap-4 w-[250px] h-[32px]"
        >
          <Button
            variant="ghost"
            size="icon"
            @click="toggleMute"
          >
            <WatchVolumeIndicators
              v-if="!muted"
              :volume="volume"
            />

            <PhSpeakerX
              v-else
              size="24"
              weight="duotone"
            />
          </Button>

          <Slider
            v-model="_internalVolume"
            :max="100"
            :step="1"
            :min="0"
            class="w-full"
            @update:model-value="changeVolume"
          />
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
