<script setup lang="ts">
// TODO: Add all rating types
const rating = defineModel<string | undefined>('rating', {
  default: undefined,
})

const customRating = defineModel<string | undefined>('customRating', {
  default: undefined,
})
</script>

<template>
  <div class="parental inline-flex flex-col gap-2">
    <h2 class="font-semibold">
      Parental
    </h2>
    <div class="h-[2px] w-full dark:bg-white/5 light:bg-black/25 rounded-lg" />

    <div class="grid grid-cols-4 items-center gap-4">
      <Label
        for="path"
        class="text-left"
      > Rating </Label>
      <Input
        id="path"
        v-model="rating"
        class="col-span-3"
      />
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
      <Label
        for="path"
        class="text-left col-span-1"
      > Custom Rating </Label>
      <Input
        id="path"
        v-model="customRating"
        class="col-span-3"
      />
    </div>
  </div>
</template>
