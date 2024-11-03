<script setup lang="ts">
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";

const { item } = defineProps<{ item: BaseItemDto }>();

const media = useMediaBrowserStore();

const itemHasLogo = () => {
  const logo = item.ImageTags?.["Logo"];

  if (!logo) return;

  return logo;
};
</script>

<template>
  <img
    v-if="itemHasLogo()"
    :src="media.generateImageURL(item.Id!!, 'Logo', 500, undefined, 100)"
  />
</template>
