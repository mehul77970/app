<script setup lang="ts">
const genres = defineModel<string[] | undefined>("genres", { default: [] });

const studios = defineModel<string[] | undefined>("studios", { default: [] });

const tags = defineModel<string[] | undefined>("tags", { default: [] });
</script>

<template>
  <div class="attributes inline-flex flex-col gap-2">
    <h2 class="font-semibold">Attributes</h2>
    <div class="h-[2px] w-full dark:bg-white/5 light:bg-black/25 rounded-lg" />

    <div class="grid items-center gap-2">
      <Label for="genres">Genres</Label>
      <TagsInput v-model="genres">
        <TagsInputItem v-for="item in genres" :key="item" :value="item">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>

        <TagsInputInput placeholder="Add more genres" />
      </TagsInput>
    </div>
    <div class="grid items-center gap-2">
      <Label for="genres">Studios</Label>
      <TagsInput v-model="studios">
        <TagsInputItem v-for="item in studios" :key="item" :value="item">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>

        <TagsInputInput placeholder="Add more studios" />
      </TagsInput>
    </div>
    <div class="grid items-center gap-2">
      <Label for="genres">Tags</Label>
      <TagsInput v-model="tags">
        <TagsInputItem v-for="item in tags" :key="item" :value="item">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>

        <TagsInputInput placeholder="Add more tags" />
      </TagsInput>
    </div>
  </div>
</template>
