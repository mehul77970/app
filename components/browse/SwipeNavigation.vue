<script setup lang="ts">
import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue'
import { useSwipe, useVibrate } from '@vueuse/core'
import { animate, spring } from 'motion'
import Motion from '@/components/ui/motion/Motion.vue'

const minSwipeDistance = 90

const { currentPageNum = 1, setPage, swipeContainer } = defineProps<{
  currentPageNum?: number
  setPage: (page: number) => void
  swipeContainer: HTMLElement
}>()

const { direction, isSwiping, lengthX } = useSwipe(swipeContainer, {
  passive: true,
})

const { vibrate: vibrateNavigate } = useVibrate({ pattern: 10 })

const absoluteLengthX = computed(() => Math.abs(lengthX.value))
const isMinDistance = computed(() => absoluteLengthX.value > minSwipeDistance)

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)

let lastSwipe = false

watch(lengthX, () => {
  if (!isSwiping.value || lastSwipe) return

  if (absoluteLengthX.value > minSwipeDistance) {
    lastSwipe = true
    vibrateNavigate()

    try {
      switch (direction.value) {
        case 'right':
          animate(
            '#arrow',
            { left: [0, 20] },
            { type: spring, bounce: 0.3, duration: 0.8 },
          )
          break
        case 'left':
          animate(
            '#arrow',
            { right: [0, 20] },
            { type: spring, bounce: 0.3, duration: 0.8 },
          )
          break
      }
    }
    catch (e: unknown) {
      console.log(e)
    }
    finally {
      setTimeout(() => {
        if (direction.value === 'right') return setPage(currentPageNum - 1)

        setPage(currentPageNum + 1)
      }, 250)
    }
  }
})

watch(isSwiping, (_, newValue) => {
  if (newValue) return

  lastSwipe = false
})
</script>

<template>
  <div>
    <template v-if="isSwiping">
      <div
        v-if="direction === 'right' || direction === 'left'"
        id="arrow"
        class="fixed w-0 size-[40px] top-15 z-[20] bg-black/25 backdrop-blur-lg p-2 rounded-full"
        :style="`width: ${isMinDistance ? 'auto' : clamp(absoluteLengthX * .4, 5, 40) + 'px'}; ${direction === 'right' ? 'left: 0' : 'right: 0'};`"
      >
        <Motion
          v-if="absoluteLengthX > 80"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
        >
          <PhArrowLeft
            v-if="direction === 'right'"
            class="size-6"
          />
          <PhArrowRight
            v-if="direction === 'left'"
            class="size-6"
          />
        </Motion>
      </div>
    </template>
  </div>
</template>
