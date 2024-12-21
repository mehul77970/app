<script setup lang="ts">
import type { Scheme } from '~/lib/material'

const { scheme = undefined } = defineProps<{ scheme?: Scheme | undefined }>()

const computedScheme = computed(() => scheme)
provide('scheme', computedScheme)
</script>

<template>
  <slot />
</template>
