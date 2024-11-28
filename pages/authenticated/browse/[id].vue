<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue'
import Presence from '@/components/ui/motion/Presence.vue'
import Motion from '@/components/ui/motion/Motion.vue'
</script>

<template>
  <ShadfinErrorBoundary>
    <Presence>
      <Suspense>
        <BrowseItemPage />

        <template #fallback>
          <Motion
            :initial="{ opacity: 1, backdropFilter: 'blur(4px) saturate(0%)' }"
            :exit="{ opacity: [1, 0], backdropFilter: ['blur(4px) saturate(0%)', 'blur(0px) saturate(100%)'] }"
            :transition="{ duration: .25, easing: 'ease-in' }"
            class="absolute z-[99] w-full h-full flex justify-center items-center bg-background/85"
          >
            <PhCircleNotch
              class="size-24 animate-spin"
              weight="bold"
            />
          </Motion>
        </template>
      </Suspense>
    </Presence>
  </ShadfinErrorBoundary>
</template>
