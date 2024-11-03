<script setup lang="ts">
import { PhWrench } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'

const playerStore = usePlayerStore()

const debuggerActive = computed(() => playerStore.debug.enabled)

const toggleDebug = () => {
  playerStore.debug.enabled = !debuggerActive.value
}
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    class="absolute m-4 right-0"
    @click.stop="toggleDebug"
  >
    <PhWrench
      :size="24"
      :weight="debuggerActive ? 'fill' : 'regular'"
    />
  </Button>
</template>
