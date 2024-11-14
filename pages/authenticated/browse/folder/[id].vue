<script setup lang="ts">
definePageMeta({ layout: "authenticated" });

const route = useRoute();
const mediaBrowser = useMediaBrowserStore();
const folder = await mediaBrowser.getItem(route.params.id! as string);
const items = await mediaBrowser.getItemsOfView(folder.Id!, 99999);
</script>

<template>
  <BrowseLayout>
    <BrowseItemCard :item="folder" />

    <template #preview>
      <div class="flex flex-col gap-8 justify-center">
        <div v-if="folder.Overview" class="flex flex-col gap-2">
          <h2 class="text-xl font-semibold">Overview</h2>
          <p class="max-w-[750px] break-words">
            {{ folder.Overview }}
          </p>
        </div>
      </div>
    </template>
    <template #items>
      <h2 class="text-xl font-semibold">Items</h2>
      <div
        class="seasons flex flex-wrap gap-8 items-center justify-center lg:justify-start max-w-full shadow-lg"
      >
        <NuxtLink
          v-for="(season, index) in items"
          :key="index"
          :to="`/browse/${season.Type}/${season.Id}?name=${season.Name}&type=${season.Type}`"
        >
          <div
            class="season inline-flex flex-col justify-center gap-2 max-w-full lg:h-[500px] group"
          >
            <h3
              class="text-lg group-hover:underline group-hover:text-opacity-75 text-white"
            >
              {{ season.Name }}
            </h3>
            <img
              :src="mediaBrowser.generateImageURL(season.Id!!)"
              class="h-full w-full rounded-lg transition-all duration-250 group-hover:opacity-75 object-cover"
            />
          </div>
        </NuxtLink>
      </div>
    </template>
  </BrowseLayout>
</template>
