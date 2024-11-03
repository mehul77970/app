<script setup lang="ts">
import {
  PhArrowsCounterClockwise,
  PhInfo,
  PhTreeStructure,
} from '@phosphor-icons/vue'
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'
import { truncate } from '@/lib/utils'
import GlobalImageWithPlaceholder from '@/components/global/ImageWithPlaceholder.vue'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

const {
  name = 'N/A',
  id = '???',
  type = 'All',
  count = 1,
  item,
} = defineProps<{
  name?: string
  id?: string
  type?: string
  count?: number
  item: BaseItemDto
}>()

const mediaBrowserStore = useMediaBrowserStore()

const image = mediaBrowserStore.generateImageURL(id, undefined, 430, 300, 50)

const metadataDialogOpen = ref(false)
const aboutDialogOpen = ref(false)
const refreshDialogOpen = ref(false)

const openMetadataEditor = () => {
  metadataDialogOpen.value = true
}

const openAboutDialog = () => {
  aboutDialogOpen.value = true
}

const openRefreshDialog = () => {
  refreshDialogOpen.value = true
}
</script>

<template>
  <Dialog v-model:open="metadataDialogOpen">
    <BrowseMetadata
      v-model="metadataDialogOpen"
      :item
    />
  </Dialog>

  <Dialog v-model:open="aboutDialogOpen">
    <BrowseAbout
      v-if="aboutDialogOpen"
      :item
    />
  </Dialog>

  <Dialog v-model:open="refreshDialogOpen">
    <BrowseRefresh
      v-model="refreshDialogOpen"
      :item
    />
  </Dialog>
  <ContextMenu>
    <ContextMenuTrigger>
      <NuxtLink
        class="flex flex-col gap-1 px-4 py-2 group cursor-pointer"
        :to="{
          name: `authenticated-browse-${type.toLowerCase()}-id`,
          params: { id },
          query: { name, type },
        }"
      >
        <div class="inline-flex justify-center items-center">
          <span
            class="text-center text-sm lg:text-[15px] font-semibold transition-all duration-250 ease-in-out group-hover:text-white/50 group-focus-visible:text-white/50 name-transition"
          >{{
            truncate(name, {
              length: 18,
              position: "end",
            })
          }}</span>
        </div>
        <div
          class="flex flex-col flex-grow-1 justify-start items-center relative rounded-md group"
        >
          <GlobalImageWithPlaceholder
            v-if="image"
            :src="image"
            class-name="object-cover h-[430px] w-[300px] rounded-md transition-all duration-250 ease-in-out group-hover:scale-[102%] group-focus-visible:scale-[102%] browse-card-transition selectable"
          />

          <img
            v-else
            src="/placeholder.svg"
            class="object-cover h-[430px] w-[300px] rounded-md transition-all duration-250 ease-in-out hover:scale-[102%] selectable"
          >
          <div
            class="w-[20%] h-1 bg-transparent absolute top-2 z-5 transition-all duration-250 rounded-lg group-hover:bg-white/50"
          />
          <div
            class="absolute m-2 right-0 p-3 bg-accent aspect-square h-[32px] rounded-full inline-flex items-center justify-center font-semibold group-hover:opacity-0 group-focus-visible:opacity-0"
          >
            {{ count }}
          </div>
        </div>
      </NuxtLink>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem
        class="gap-2"
        @click="openAboutDialog"
      >
        <PhInfo
          weight="fill"
          class="size-5"
        />
        About
      </ContextMenuItem>
      <ContextMenuItem
        class="gap-2"
        @click="openMetadataEditor"
      >
        <PhTreeStructure
          weight="fill"
          class="size-5 text-blue-400"
        />
        Metadata
      </ContextMenuItem>
      <ContextMenuItem
        class="gap-2"
        @click="openRefreshDialog"
      >
        <PhArrowsCounterClockwise
          weight="fill"
          class="size-5 text-orange-400"
        />
        Refresh Metadata
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
