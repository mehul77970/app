<script setup lang="ts">
const { path } = defineProps<{
  path: string
}>()
</script>

<template>
  <div class="storage inline-flex flex-col gap-2">
    <h2 class="font-semibold">
      Storage
    </h2>
    <div class="h-[2px] w-full dark:bg-white/5 light:bg-black/25 rounded-lg" />

    <div class="grid grid-cols-4 items-center gap-4">
      <Label
        for="path"
        class="text-left"
      > Path </Label>
      <Input
        id="path"
        :value="path"
        class="col-span-3"
        disabled
      />
    </div>
  </div>
</template>
