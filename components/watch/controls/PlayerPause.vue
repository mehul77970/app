<script setup lang="ts">
import { PhCircleNotch, PhPause } from '@phosphor-icons/vue'

const playerStore = usePlayerStore()

const paused = computed(() => playerStore.paused)
const loading = computed(() => playerStore.loading)

function getEndsAtTime() {
  const runtimeMs = playerStore.duration
  const playerMs = playerStore.position.value * 1000

  const millisecondsLeft = runtimeMs - playerMs

  return new Intl.DateTimeFormat('default', {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(Date.now() + millisecondsLeft))
}
</script>

<template>
  <div
    class="w-full h-full group absolute"
  >
    <TransitionGroup name="fade-short-slide">
      <div
        v-if="paused && !loading"
        class="min-w-full h-full absolute inline-flex flex-col gap-4 justify-center items-center backdrop-blur-sm backdrop-saturate-50 bg-black/50"
      >
        <PhPause
          :size="72"
          weight="fill"
        />
        <h1 class="text-xl">
          Ends at {{ getEndsAtTime() }}
        </h1>
      </div>

      <div
        v-if="loading"
        class="w-full h-full absolute inline-flex flex-col gap-4 justify-center items-center backdrop-blur-sm backdrop-saturate-50 z-[0] bg-black/50"
      >
        <PhCircleNotch
          :size="72"
          weight="bold"
          class="animate-spin"
        />
      </div>
    </TransitionGroup>
  </div>
</template>
