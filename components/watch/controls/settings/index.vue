<script lang="ts" setup>
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'

import { PhGearSix } from '@phosphor-icons/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const { item } = defineProps<{
  item: BaseItemDto
}>()

const playerStore = usePlayerStore()

const open = ref(false)

const updateContextMenuOpenState = (open: boolean) => {
  playerStore.hideControls = !open
}
</script>

<template>
  <DropdownMenu
    v-model:open="open"
    @update:open="updateContextMenuOpenState"
  >
    <DropdownMenuTrigger as-child>
      <Button
        v-focus
        variant="ghost"
        size="icon"
        class="selectable"
      >
        <PhGearSix
          :size="24"
          :weight="open ? 'fill' : 'regular'"
        />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent side="top">
      <!-- Subtitle Settings -->
      <WatchControlsSettingsSubtitles :item />
      <!-- Audio Settings -->
      <WatchControlsSettingsAudio :item />
      <!-- Video Settings -->
    </DropdownMenuContent>
  </DropdownMenu>
</template>
