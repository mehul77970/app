<script setup lang="ts">
import {
  PhArrowsCounterClockwise,
  PhInfo,
  PhTreeStructure,
  PhStar,
  PhPlay,
  PhDotsThreeVertical,
  PhHeart,
} from '@phosphor-icons/vue'
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'

import ms from 'ms'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { getDefaultMediaStreams } from '~/lib/player'

const {
  name = 'N/A',
  id = '???',
  type = 'All',
  item,
} = defineProps<{
  name?: string
  id?: string
  type?: string
  count?: number
  item: BaseItemDto
}>()

const mediaBrowserStore = useMediaBrowserStore()

const router = useRouter()
const image = mediaBrowserStore.generateImageURL(id, undefined, 100, undefined, 50)

const defaultSources = getDefaultMediaStreams(item)
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

const goTo = () => {
  router.push({
    name: `authenticated-browse-${type.toLowerCase()}-id`,
    params: { id },
    query: { name, type },
  })
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
    <ContextMenuTrigger as-child>
      <TableRow
        class="group cursor-pointer"
        @click="goTo"
      >
        <TableCell class="font-medium p-2">
          <ImageWithPlaceholder
            v-if="item.ImageBlurHashes?.Primary"
            :src="image"
            class-name="size-16 min-w-[4rem] object-cover rounded-md"
          />
          <img
            v-else
            src="/placeholder.svg"
            class="size-16 object-cover rounded-md"
          >
        </TableCell>
        <TableCell class="text-sm md:text-lg text-primary p-2">
          {{ item.Name }}
        </TableCell>
        <TableCell class="text-left">
          <template v-if="item.RunTimeTicks">
            {{ ms(item?.RunTimeTicks / 10000 || 0 / 10000) }}
          </template>
        </TableCell>
        <TableCell>
          <template v-if="item.CommunityRating">
            <div class="inline-flex justify-center items-center gap-2">
              <PhStar
                class="size-4"
                weight="fill"
              />
              {{ item?.CommunityRating?.toFixed(1) }}
            </div>
          </template>
        </TableCell>
        <TableCell class="text-left p-2">
          <div
            v-if="item.Type === 'Movie'"
            class="hidden lg:inline-flex flex-wrap"
          >
            <TextAudioWithFeatures
              v-if="defaultSources.audio"
              :audio="defaultSources.audio"
              feature-only
            />
            <TextVideoWithFeatures
              v-if="defaultSources.video"
              :video="defaultSources.video"
              feature-only
            />
          </div>
        </TableCell>

        <TableCell class="text-left p-2">
          <div class="hidden sm:inline-flex">
            <Button
              variant="outline"
              size="icon"
              class="rounded-tr-none rounded-br-none"
            >
              <PhPlay
                class="size-5"
                weight="fill"
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              class="rounded-r-none rounded-l-none"
            >
              <PhHeart
                class="size-5"
                weight="fill"
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              class="rounded-tl-none rounded-bl-none"
            >
              <PhDotsThreeVertical
                class="size-5"
                weight="bold"
              />
            </Button>
          </div>
        </TableCell>
      </TableRow>
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
