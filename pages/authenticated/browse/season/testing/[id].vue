<script setup lang="ts">
definePageMeta({ layout: "authenticated" });
const route = useRoute();
const mediaBrowser = useMediaBrowserStore();
const season = await mediaBrowser.getItem(route.params.id! as string);
const parentName = computed(() => route.query.parentName);
const parent = computed(() => route.query.parent);
const episodes = await mediaBrowser.getEpisodesOfSeason(
  parent.value,
  season.Id!,
  99999,
);
</script>

<template>
  <BrowseLayout>
    <BrowseItemCard :item="season" :custom-original-name="parentName" />

    <template #preview>
      <div class="flex flex-col gap-8 justify-center">
        <div v-if="season.Overview" class="flex flex-col gap-2">
          <h2 class="text-xl font-semibold">Overview</h2>
          <p class="max-w-[750px] break-words">
            {{ season.Overview }}
          </p>
        </div>
      </div>
    </template>
    <template #items>
      <div class="flex flex-wrap overflow-hidden max-h-full gap-4">
        <VideoPreview
          v-for="(episode, index) in episodes"
          :key="index"
          :item="episode"
          class="max-h-full flex justify-center items-center aspect-auto"
          :show-progress="episode.UserData.PlaybackPositionTicks > 0"
          episode
        />
      </div>
    </template>
  </BrowseLayout>
</template>
