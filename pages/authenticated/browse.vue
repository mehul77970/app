<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue'
import Presence from '@/components/ui/motion/Presence.vue'
import Motion from '@/components/ui/motion/Motion.vue'
</script>

<template>
  <div
    class="flex flex-col w-full min-h-full justify-start items-center gap-12"
  >
    <Presence>
      <Suspense>
        <NuxtPage />

        <template #fallback>
          <Motion
            :initial="{ opacity: 1, backdropFilter: 'blur(4px) saturate(0%)' }"
            :exit="{ opacity: [1, 0], backdropFilter: ['blur(4px) saturate(0%)', 'blur(0px) saturate(100%)'] }"
            :transition="{ duration: 0.20, easing: 'ease-in' }"
            class="fixed z-[99] w-full h-full flex justify-center items-center bg-background/85"
          >
            <PhCircleNotch
              class="size-24 animate-spin"
              weight="bold"
            />
          </Motion>
        </template>
      </Suspense>
    </Presence>
  </div>
</template>
