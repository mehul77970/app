<script setup lang="ts">
import { PhCornersIn, PhCornersOut } from '@phosphor-icons/vue'
import { addComponentEventListener } from '#imports'
import { Button } from '@/components/ui/button'

const playerStore = usePlayerStore()
const fullscreen = computed(() => playerStore.fullscreen)

onMounted(() => {
  addComponentEventListener(
    document.documentElement,
    'fullscreenchange',
    () => {
      playerStore.fullscreen = !playerStore.fullscreen
    },
  )
})

const toggleFullscreen = () => {
  if (fullscreen.value) {
    document.exitFullscreen()
  }
  else {
    document.documentElement.requestFullscreen()
  }
}
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    @click="toggleFullscreen"
  >
    <PhCornersOut
      v-if="!fullscreen"
      :size="24"
    />

    <PhCornersIn
      v-else
      :size="24"
    />
  </Button>
</template>
