<script setup lang="ts">
import { PhWarning } from '@phosphor-icons/vue'
</script>

<template>
  <div
    class="http-player fixed z-[99] bg-background flex-wrap text-center w-full h-full gap-2 text-orange-400 flex justify-center items-center"
  >
    <PhWarning
      weight="fill"
      class="size-20"
    />

    <h1 class="font-semibold text-2xl">
      DirectPlay is currently not supported.
    </h1>
  </div>
</template>
