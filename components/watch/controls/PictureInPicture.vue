<script setup lang="ts">
import { PhPictureInPicture } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'

const playerStore = usePlayerStore()

const pipAPIAvaliable = ref(false)

const inPiP = computed(() => playerStore.pictureInPicture)

onMounted(() => {
  // We have access to the PiP API (Usually only avaliable in Chromium based browsers)
  if (document.pictureInPictureEnabled) {
    pipAPIAvaliable.value = true
  }
})

const togglePiP = () => {
  playerStore.pictureInPicture = !inPiP.value
}
</script>

<template>
  <TooltipProvider v-if="!pipAPIAvaliable">
    <Tooltip>
      <TooltipTrigger class="cursor-not-allowed">
        <PhPictureInPicture
          :size="24"
          class="text-red-400 m-1.5"
        />
      </TooltipTrigger>
      <TooltipContent class="text-center">
        Your browser doesn't support the PiP API<br>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API"
          class="underline"
          target="_blank"
        >Learn More</a>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>

  <Button
    v-else
    variant="ghost"
    size="icon"
    @click="togglePiP"
  >
    <PhPictureInPicture
      :size="24"
      :weight="inPiP ? 'fill' : 'regular'"
    />
  </Button>
</template>
