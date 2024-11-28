<script setup lang="ts">
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'
import {
  PhArrowsCounterClockwise,
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

const image = useServerImage(item, { type: 'Primary', size: 480, quality: 75 })
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
        class="flex flex-col gap-1 px-4 py-2 group cursor-pointer"
        :style="`${basis > 0 ? `width: ${(1 / basis) * 100}%;` : 'width: auto;'}`"
        :to="{
          name: `authenticated-browse-${type.toLowerCase()}-id`,
          params: { id },
          query: { name, type },
        }"
      >
        <div class="inline-flex justify-center items-center">
          <span
            :class="
              cn(
                'text-center text-sm lg:text-[15px] text-ellipsis max-w-full break-all font-semibold transition-all duration-250 ease-in-out group-hover:text-white/50 group-focus-visible:text-white/50 name-transition',
                basis <= 6 ? 'lg:text-2xl text-sm' : '',
              )
            "
          >{{
            truncate(name, {
              length: 18,
              position: "end",
            })
          }}</span>
        </div>
        <div
          :class="
            cn(
              'flex flex-col flex-grow items-stretch mt-auto w-full relative rounded-md group',
              basis === 0 ? 'h-full' : '',
            )
          "
        >
          <img
            :src="image"
            class="h-full w-full object-cover rounded-md aspect-portrait transition-all duration-250 ease-in-out group-hover:scale-[102%] group-focus-visible:scale-[102%] browse-card-transition selectable"
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
