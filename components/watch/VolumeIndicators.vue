<script setup lang="ts">
import { PhSpeakerHigh, PhSpeakerLow, PhSpeakerX } from "@phosphor-icons/vue";

const { volume = 100 } = defineProps<{
  volume: number;
}>();
</script>

<template>
  <PhSpeakerHigh v-if="volume >= 50" weight="duotone" size="24" />
  <PhSpeakerLow v-if="volume < 50 && volume != 0" weight="duotone" size="24" />
  <PhSpeakerX v-if="volume == 0" weight="duotone" size="24" />
</template>
