<script setup lang="ts">
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { getHumanReadableSize } from "~/lib/utils";

const mediaBrowserStore = useMediaBrowserStore();

const { item } = defineProps<{ item: BaseItemDto }>();

const items = ref([] as BaseItemDto[]);

const totalSize = ref(0);

switch (item.Type) {
  case "Series": {
    const getSeriesInfo = async () => {
      const seasons = await mediaBrowserStore.getSeasons(item.Id!, 99);

      for (let i = 0; seasons.length > i; i++) {
        const season = seasons[i];

        const episodes = await mediaBrowserStore.getEpisodesOfSeason(
          item.Id!,
          season.Id!,
          99,
        );

        for (let ei = 0; episodes.length > ei; ei++) {
          const _episode = episodes[ei];
          const getEpisode = async () => {
            const episode = await mediaBrowserStore.getItem(_episode.Id!);

            if (!episode.MediaSources?.[0].Size) return;
            totalSize.value += episode.MediaSources![0].Size;
            items.value.push(episode);
          };

          getEpisode();
        }
      }
    };

    getSeriesInfo();
  }
}
</script>

<template>
  <DialogContent class="sm:max-w-[625px] max-h-[100vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>About {{ item.Name }}</DialogTitle>
    </DialogHeader>
    <div class="grid gap-4 py-4">
      <div class="storage inline-flex flex-col gap-2">
        <h2 class="font-semibold">Storage</h2>

        <div class="inline-flex flex-col gap-2 flex-wrap">
          <div class="inline-flex justify-center items-start gap-1 flex-col">
            <span class="font-semibold">Size</span>
            <span>{{ getHumanReadableSize(totalSize, true) }}</span>
          </div>

          <div class="inline-flex justify-start items-start gap-1 flex-col">
            <span class="font-semibold">Total Files</span>
            <span>{{ items.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- <DialogFooter>
            <Button type="submit">
                Save changes
            </Button>
        </DialogFooter> -->
  </DialogContent>
</template>
