<script lang="ts" setup>
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'
import { PhClosedCaptioning } from '@phosphor-icons/vue'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { getSubtitleStreams } from '~/lib/player'

const { item } = defineProps<{
  item: BaseItemDto
}>()

const subtitleSources = getSubtitleStreams(item)

const playerStore = usePlayerStore()

const selectedSubtitle = computed(() => playerStore.subtitle)

function changeSubtitle(subtitle: SubtitleSource) {
  playerStore.subtitle = subtitle
}
</script>

<template>
  <DropdownMenuSub>
    <DropdownMenuSubTrigger>
      <div class="inline-flex gap-2 justify-center items-center">
        <PhClosedCaptioning
          :size="24"
          weight="fill"
        />
        <span>Subtitles</span>
      </div>
    </DropdownMenuSubTrigger>

    <DropdownMenuPortal>
      <DropdownMenuSubContent>
        <DropdownMenuCheckboxItem
          v-for="subtitle in subtitleSources"
          :key="subtitle?.source?.Index"
          :checked="subtitle?.source?.Index === selectedSubtitle?.source?.Index"
          @click="changeSubtitle(subtitle)"
        >
          {{ subtitle.title }}
        </DropdownMenuCheckboxItem>
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
</template>
