<script setup lang="ts">
import { PhCheckCircle } from '@phosphor-icons/vue'
import { cn } from '~/lib/utils'

interface Props {
  max: number
  value: number
  min: number
  gaugePrimaryColor: string
  gaugeSecondaryColor: string
  className: string
  showText?: boolean
  showComplete?: boolean
}

const {
  max = 100,
  min = 0,
  value = 0,
  gaugePrimaryColor,
  gaugeSecondaryColor,
  className = '',
  showText = false,
  showComplete = false,
} = defineProps<Props>()

const circumference = 2 * Math.PI * 45
const percentPx = circumference / 100
const currentPercent = computed(() => ((value - min) / (max - min)) * 100)
</script>

<template>
  <div
    :class="cn('relative size-40 text-2xl font-semibold', className)"
    :style="{
      '--circle-size': '100px',
      '--circumference': circumference,
      '--percent-to-px': `${percentPx}px`,
      '--gap-percent': '5',
      '--offset-factor': '0',
      '--transition-length': '1s',
      '--transition-step': '200ms',
      '--delay': '0s',
      '--percent-to-deg': '3.6deg',
      'transform': 'translateZ(0)',
    }"
  >
    <svg
      v-if="currentPercent !== 100"
      fill="none"
      class="size-full"
      stroke-width="2"
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke-width="10"
        stroke-dashoffset="0"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="opacity-100"
        :style="{
          'stroke': gaugeSecondaryColor,
          '--stroke-percent': 90 - currentPercent,
          '--offset-factor-secondary': 'calc(1 - var(--offset-factor))',
          'strokeDasharray':
            'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
          'transform':
            'rotate(calc(1turn - 90deg - (var(--gap-percent) * var(--percent-to-deg) * var(--offset-factor-secondary)))) scaleY(-1)',
          'transition': 'all var(--transition-length) ease var(--delay)',
          'transformOrigin':
            'calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)',
        }"
      />

      <circle
        cx="50"
        cy="50"
        r="45"
        stroke-width="10"
        stroke-dashoffset="0"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="opacity-100"
        :style="{
          'stroke': gaugePrimaryColor,
          '--stroke-percent': currentPercent,
          'strokeDasharray':
            'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
          'transition':
            'var(--transition-length) ease var(--delay),stroke var(--transition-length) ease var(--delay)',
          'transitionProperty': 'stroke-dasharray,transform',
          'transform':
            'rotate(calc(-90deg + var(--gap-percent) * var(--offset-factor) * var(--percent-to-deg)))',
          'transformOrigin':
            'calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)',
        }"
      />
    </svg>

    <div
      v-if="showComplete && value === 100"
      class="duration-[var(--transition-length)] delay-[var(--delay)] absolute inset-0 w-full h-full size-fit ease-linear animate-in fade-in inline-flex justify-center items-center rounded-lg"
    >
      <PhCheckCircle
        weight="fill"
        :class="cn('size-40', className)"
        color="currentColor"
        width="100%"
        height="100%"
      />
    </div>
    <span
      v-if="showText"
      data-current-value="{currentPercent}"
      class="duration-[var(--transition-length)] delay-[var(--delay)] absolute inset-0 m-auto size-fit ease-linear animate-in fade-in text-white"
    >
      {{ currentPercent }}%
    </span>
  </div>
</template>
