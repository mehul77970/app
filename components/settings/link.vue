<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import { cn } from "~/lib/utils";

const { to } = defineProps<{ to: RouteLocationRaw }>();

const router = useRouter();

const currentRoute = computed(() => router.currentRoute.value);

console.log(currentRoute, to, currentRoute.value == to);
</script>

<template>
  <NuxtLink
    :to
    :class="
      cn(
        currentRoute.name == /*@ts-ignore*/ to.name
          ? 'font-semibold text-primary'
          : '',
      )
    "
  >
    <slot />
  </NuxtLink>
</template>
