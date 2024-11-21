<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { cn } from '~/lib/utils'

const { to } = defineProps<{ to: RouteLocationRaw }>()

const router = useRouter()

const currentRoute = computed(() => router.currentRoute.value)
</script>

<template>
  <NuxtLink
    :to
    :class="
      cn(
        /* @ts-ignore  */
        currentRoute.path === router.resolve(to).path ? 'text-primary/50' : '',
      )
    "
  >
    <slot />
  </NuxtLink>
</template>
