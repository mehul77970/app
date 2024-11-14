<script setup lang="ts">
import type { NameGuidPair } from "@jellyfin/sdk/lib/generated-client";

const {
  tag,
  type,
  last = false,
} = defineProps<{
  tag: NameGuidPair;
  type: "genre" | "studio";
  last: boolean;
}>();

function generateTagURL() {
  switch (type) {
    case "genre":
      return `/browse/genres/${tag.Id}`;
    case "studio":
      return `/browse/studios/${tag.Id}`;
  }
}
</script>

<template>
  <NuxtLink
    :href="generateTagURL()"
    class="transition-all duration-250 text-white/50 hover:text-white/85 hover:underline focus-visible:text-white/85 focus-visible:underline"
  >
    {{ tag.Name }}{{ last ? "" : "," }}
  </NuxtLink>
</template>
