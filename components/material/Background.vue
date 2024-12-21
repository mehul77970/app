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
    class="bg-transparent transition-colors duration-250 ease"
    :style="{ '--material-bg': scheme ? hexFromArgb(
      /* @ts-expect-error unknown key */
      scheme.props[color]) : '' }"
  >
    <slot />
  </div>
</template>
