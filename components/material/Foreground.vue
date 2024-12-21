<script setup lang="ts">
import type { Scheme } from '~/lib/material'
import { hexFromArgb } from '~/lib/material'

const scheme = inject('scheme') as Scheme | undefined

const { color } = defineProps<{
  color: string
}>()
</script>

<template>
  <div
    class="text-primary transition-colors duration-1000 ease"
    :style="{ color: scheme ? hexFromArgb(
      /* @ts-expect-error Unknown key */
      scheme.props[color]) : '' }"
  >
    <slot />
  </div>
</template>
