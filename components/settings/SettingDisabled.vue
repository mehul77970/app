<script setup lang="ts">
import { PhWarningDiamond } from '@phosphor-icons/vue'

const { disabled = false } = defineProps<{ disabled?: boolean, reason?: string }>()
</script>

<template>
  <div class="relative">
    <Transition name="fade-short-slide">
      <div
        v-if="disabled"
        class="absolute z-[2] w-full h-full inline-flex flex-col gap-2 cursor-not-allowed text-center break-all select-none justify-center items-center backdrop-blur-sm backdrop-saturate-50"
      >
        <PhWarningDiamond
          class="size-12 text-yellow-500"
          weight="duotone"
        />
        <h2 class="font-semibold text-xl">
          This setting is disabled
        </h2>
        <div class="text-foreground/75">
          <slot name="reason" />
        </div>
      </div>
    </Transition>

    <slot />
  </div>
</template>
