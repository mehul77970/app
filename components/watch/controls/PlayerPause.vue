<script setup lang="ts">
import { PhPause, PhCircleNotch, PhArrowArcLeft } from "@phosphor-icons/vue";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Button } from "@/components/ui/button";

const { info } = defineProps<{
  info: BaseItemDto;
}>();

const playerStore = usePlayerStore();

const paused = computed(() => playerStore.paused);
const loading = computed(() => playerStore.loading);

const router = useRouter();

const getEndsAtTime = () => {
  const runtimeMs = info.RunTimeTicks / 10000;
  const playerMs = playerStore.position.value * 1000;

  const millisecondsLeft = runtimeMs - playerMs;

  return new Intl.DateTimeFormat("default", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(Date.now() + millisecondsLeft));
};

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div v-focus-section class="w-full h-full group absolute">
    <TransitionGroup name="fade-short-slide">
      <div
        v-if="paused && !loading"
        class="min-w-full h-full absolute inline-flex flex-col gap-4 justify-center items-center backdrop-blur-sm backdrop-saturate-50 bg-black/50"
      >
        <PhPause :size="72" weight="fill" />
        <h1 class="text-xl">Ends at {{ getEndsAtTime() }}</h1>
      </div>

      <div
        v-if="loading"
        class="w-full h-full absolute inline-flex flex-col gap-4 justify-center items-center backdrop-blur-sm backdrop-saturate-50 z-[0] bg-black/50"
      >
        <PhCircleNotch :size="72" weight="bold" class="animate-spin" />
      </div>

      <Button
        v-if="paused"
        v-focus
        class="m-4 absolute selectable"
        variant="ghost"
        size="icon"
        @click="goBack"
      >
        <PhArrowArcLeft :size="24" weight="bold" />
      </Button>
    </TransitionGroup>
  </div>
</template>
