<script lang="ts" setup>
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'

import { PhSpeakerHifi } from '@phosphor-icons/vue'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import AudioWithFeatures from '~/components/global/text/AudioWithFeatures.vue'
import { getAudioStreams } from '~/lib/player'

const { item } = defineProps<{
  item: BaseItemDto
}>()

const audioSources = getAudioStreams(item)

const playerStore = usePlayerStore()

const selectedAudio = computed(() => playerStore.audio)

function changeAudio(audio: AudioSource) {
  playerStore.audio = audio
}
</script>

<template>
  <DropdownMenuSub>
    <DropdownMenuSubTrigger>
      <div
        class="inline-flex gap-2 justify-center items-center selectable"
      >
        <PhSpeakerHifi
          :size="24"
          weight="fill"
        />
        <span>Audio</span>
      </div>
    </DropdownMenuSubTrigger>

    <DropdownMenuPortal>
      <DropdownMenuSubContent>
        <DropdownMenuCheckboxItem
          v-for="audio in audioSources"
          :key="audio.source.Index"
          :checked="audio.source.Index === selectedAudio?.source.Index"
          class="align-middle"
          @click="changeAudio(audio)"
        >
          <AudioWithFeatures :audio="audio" />
        </DropdownMenuCheckboxItem>
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
</template>
