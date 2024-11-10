<script setup lang="ts">
import { PhArrowsClockwise, PhGridNine, PhSortAscending } from '@phosphor-icons/vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import SettingDisabled from '@/components/settings/SettingDisabled.vue'

const defaultBrowseBasis = 8

const settingsStore = useSettingsStore()
const { browse } = storeToRefs(settingsStore)

const basis = ref([browse.value.basis])

const createEmptyArray = (size: number) => {
  const array = []

  for (let i = 0; i < size; i++) {
    array.push('')
  }

  return array
}

const resetBrowseBasis = () => {
  basis.value[0] = defaultBrowseBasis
  browse.value.basis = defaultBrowseBasis
}

const switchBrowseBasisToAuto = () => {
  basis.value[0] = 0
  browse.value.basis = 0
}
</script>

<template>
  <SettingDisabled :disabled="browse.layout == 'list'">
    <template #reason>
      <p>Browse layout must be set to <b>Grid</b>, or <b>Thumbnail</b></p>
    </template>
    <Card class="max-w-full">
      <CardHeader>
        <CardTitle class="inline-flex justify-start items-center gap-4">
          Item Basis
        </CardTitle>
        <CardDescription>
          <div class="item-card-preview mt-2">
            <h3>Preview</h3>

            <div
              class="browse-wrapper w-full max-h-[545px] select-none overflow-y-scroll h-fit inline-flex flex-col justify-start pt-4 items-center aspect-video bg-background rounded-lg relative"
            >
              <div class="inline-flex flex-wrap options bg-primary-foreground rounded-md pointer-events-none">
                <Button
                  size="icon"
                  variant="ghost"
                  class="rounded-tr-none rounded-br-none w-8 h-fit aspect-square"
                >
                  <PhGridNine
                    class="size-4"
                    weight="fill"
                  />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  class="rounded-t-none rounded-b-none group relative w-8 h-fit aspect-square"
                >
                  <PhArrowsClockwise
                    class="size-4 group-hover:rotate-[10deg] duration-250 ease transition-all absolute"
                  />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  class="rounded-tl-none rounded-bl-none w-8 h-fit aspect-square"
                >
                  <PhSortAscending class="size-4" />
                </Button>
              </div>

              <div class="flex w-full justify-center flex-wrap gap-1 pointer-events-none">
                <BrowseItem
                  v-for="(_, index) in createEmptyArray(24)"
                  id="0000"
                  :key="index"
                  name="Example item"
                  type="Movie"
                  :item="{ Name: 'e' }"
                  :basis="basis[0]"
                />
              </div>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent class="inline-flex flex-col justify-between gap-3 flex-wrap w-full">
        <div class="inline-flex justify-start flex-col w-full gap-4 items-start">
          <div class="inline-flex w-full justify-between items-center gap-4">
            <h2 class="text-lg">
              Basis
            </h2>
            <div class="inline-flex gap-2">
              <Button
                class="w-full"
                :disabled="browse.basis == defaultBrowseBasis"
                @click="resetBrowseBasis"
              >
                Reset to default
              </Button>
              <Button
                class="w-full"
                :disabled="browse.basis == 0"
                @click="switchBrowseBasisToAuto"
              >
                Switch to Auto
              </Button>
            </div>
          </div>

          <p class="text-secondary-foreground/50">
            The basis of each item defines how many you would like to fit on each line
            <br>
            Will attempt to fit <b>{{ basis[0] }}</b> items per line
          </p>
          <Slider
            ref="slider"
            v-model="basis"
            :min="1"
            :max="25"
            :step="1"
            class="w-full"
          />
          <Button
            class="w-full"
            :disabled="browse.basis == basis[0]"
            @click="browse.basis = basis[0]"
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  </SettingDisabled>
</template>

<style>
div[part="cue-display"] {
  background-color: rgb(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  padding: 1%;
  border-radius: 0.25rem;
  opacity: 0.25;
  animation: vtt-caption-fade-in 100ms ease forwards;
  width: fit-content;
  text-align: center;
  font-size: var(--vtt-font-size);
  line-height: 1;
}

@keyframes vtt-caption-fade-in {
  0% {
    opacity: 0.25;
  }

  100% {
    opacity: 1;
  }
}
</style>
