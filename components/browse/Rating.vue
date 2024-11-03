<script setup lang="ts">
import { PhStar, PhStarHalf } from "@phosphor-icons/vue";

const { rating = 1 } = defineProps<{
  rating?: number;
}>();

const half = computed(() => rating / 2);
const halfStar = computed(() => Math.round(half.value % 1) == 1);
</script>

<template>
  <PhStar v-if="half >= 1" :size="24" weight="fill" />
  <PhStar v-if="half >= 2" :size="24" weight="fill" />
  <PhStar v-if="half >= 3" :size="24" weight="fill" />
  <PhStar v-if="half >= 4" :size="24" weight="fill" />
  <PhStar v-if="half >= 5" :size="24" weight="fill" />
  <PhStarHalf v-if="halfStar" :size="24" weight="fill" />
</template>
