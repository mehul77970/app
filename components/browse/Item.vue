<script setup lang="ts">
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'
import {
  PhArrowsCounterClockwise,
  PhBookmark,
  PhBookmarkSimple,
  PhCheck,
  PhGear,
  PhInfo,
  PhTreeStructure,
} from '@phosphor-icons/vue'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { cn, truncate } from '@/lib/utils'

const {
  name = 'N/A',
  id = '???',
  type = 'All',
  count = 1,
  item,
  basis = useSettingsStore().browse.basis,
} = defineProps<{
  name?: string
  id?: string
  type?: string
  count?: number
  item: BaseItemDto
  basis?: number
}>()

const userStore = useUserStore()
const admin = computed(() => userStore.isAdmin)

const image = useServerImage(item, { type: 'Primary', size: 320, quality: 100 })
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
    <LazyBrowseRefresh
      v-model="refreshDialogOpen"
      :item
    />
  </Dialog>
  <ContextMenu>
    <ContextMenuTrigger as-child>
      <NuxtLink
        class="flex flex-col px-4 py-2 group cursor-pointer"
        :style="`max-width: 320px;`"
        :to="{
          name: `authenticated-browse-${type.toLowerCase()}-id`,
          params: { id },
          query: { name, type },
        }"
      >

        <div
          :class="
            cn(
              'flex flex-col w-full items-center relative rounded-2xl group',
              basis === 0 ? '' : '',
            )
          "
        >
          <img
            :src="image"
            class="w-full aspect-[17/26] object-cover transition-all duration-250 rounded-2xl group-focus-visible:scale-[102%] browse-card-transition selectable group-hover:blur-[4px] group-hover:opacity-85"
            loading="lazy"
          >

          <div
            class="inline-flex gap-2 justify-between absolute p-1 group-hover:p-2 transition-all duration-250 ease group-hover:bg-background rounded-xl mt-2 w-[90%] cursor-default"
            @click.prevent.stop
          >
            <div class="inline-flex w-full gap-2">
              <Button
                size="icon"
                class="p-[3px] h-auto w-auto rounded-lg transition-all duration-250 ease bg-transparent text-white group-hover:bg-secondary"
                variant="secondary"
              >
                <PhCheck
                  class="size-6"
                  weight="bold"
                />
              </Button>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    size="icon"
                    class="inline-flex p-[3px] h-auto w-auto rounded-lg transition-all duration-250 ease opacity-0 group-hover:opacity-100"
                    variant="secondary"
                  >
                    <PhBookmarkSimple
                      class="size-6"
                      weight="fill"
                    />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  Bookmark
                </TooltipContent>
              </Tooltip>
            </div>
            <div class="inline-flex gap-1 opacity-0 group-hover:opacity-100">
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    size="icon"
                    class="p-[3px] h-auto w-auto rounded-lg transition-all duration-250 ease"
                    variant="ghost"
                  >

                    <PhInfo
                      class="size-6"
                      weight="fill"
                    />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  About
                </TooltipContent>
              </Tooltip>
              <Button
                size="icon"
                class="p-[3px] h-auto w-auto rounded-lg transition-all duration-250 ease"
                variant="ghost"
              >
                <Tooltip>
                  <TooltipTrigger as-child>
                    <PhArrowsCounterClockwise
                      class="size-6"
                      weight="fill"
                    />
                  </TooltipTrigger>

                  <TooltipContent>
                    Refresh Metadata
                  </TooltipContent>
                </Tooltip>
              </Button>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    size="icon"
                    class="p-[3px] h-auto w-auto rounded-lg transition-all duration-250 ease"
                    variant="ghost"
                  >
                    <PhTreeStructure
                      class="size-6"
                      weight="fill"
                    />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  Edit Metadata
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        <div class="inline-flex flex-col font-light justify-start items-start ml-1">
          <span
            :class="
              cn(
                'text-md text-ellipsis max-w-full break-all font-bold transition-all duration-250 ease-in-out group-hover:text-white/50 group-focus-visible:text-white/50 name-transition',
              )
            "
          >{{
            name
          }}</span>
          <span
            v-if="false"
            class="text-sm"
          >2 Seasons</span>
          <span class="text-sm text-primary/50">{{ item.ProductionYear }}</span>
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
