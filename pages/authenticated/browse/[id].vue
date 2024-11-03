<script setup lang="ts">
definePageMeta({ layout: "authenticated" });

const route = useRoute();
const mediaBrowser = useMediaBrowserStore();

const name = ref(route.query.name);
const items = ref(
  await mediaBrowser.getItemsOfView(route.params.id as string, 50),
);
</script>

<template>
  <div
    class="flex flex-col w-full min-h-full justify-center items-center p-3 lg:p-8 gap-12 mt-8"
  >
    <h1 class="text-4xl font-bold">
      {{ name }}
    </h1>

    <div
      id="browse-items"
      v-focus-section
      class="inline-flex flex-wrap max-w-full justify-center items-center overflow-y-auto"
    >
      <BrowseItem
        v-for="(item, index) in items"
        :id="item.Id!!"
        :key="index"
        v-focus
        :name="item.Name!!"
        :data-id="item.Id!!"
        :item
        :data-name="item.Name"
        :data-index="index"
        :type="item.Type"
        :count="item.UserData?.UnplayedItemCount || 0"
      />
    </div>
  </div>
</template>
