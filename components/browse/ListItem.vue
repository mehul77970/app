<script setup lang="ts">
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'
import {
  PhArrowsCounterClockwise,
  PhDotsThreeVertical,
  PhHeart,
  PhInfo,
  PhPlay,
  PhStar,
  PhTreeStructure,
} from '@phosphor-icons/vue'
import ms from 'ms'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

import { TableCell, TableRow } from '@/components/ui/table'
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

const router = useRouter()
const userStore = useUserStore()
const admin = computed(() => userStore.isAdmin)

const image = useServerImage(item, { type: 'Primary', size: 128, quality: 85 })

const defaultSources = getDefaultMediaStreams(item)
const metadataDialogOpen = ref(false)
const aboutDialogOpen = ref(false)
const refreshDialogOpen = ref(false)

function openMetadataEditor() {
  metadataDialogOpen.value = true
}

function openAboutDialog() {
  aboutDialogOpen.value = true
}

function openRefreshDialog() {
  refreshDialogOpen.value = true
}

function goTo() {
  router.push({
    name: `authenticated-browse-${type.toLowerCase()}-id`,
    params: { id },
    query: { name, type },
  })
}
</script>

<template>
  <Dialog v-model:open="metadataDialogOpen">
    <LazyBrowseMetadata
      v-model="metadataDialogOpen"
      :item
    />
  </Dialog>

  <Dialog v-model:open="aboutDialogOpen">
    <LazyBrowseAbout
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
        @click.prevent.stop="goTo"
      >
        <TableCell class="font-medium p-2">
          <img
            :src="image"
            class="size-16 min-w-[4rem] object-cover rounded-md"
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
        :disabled="!admin"
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
        :disabled="!admin"
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
