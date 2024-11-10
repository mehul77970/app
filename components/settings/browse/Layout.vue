<script setup lang="ts">
import { PhArrowsClockwise, PhGridNine, PhSortAscending } from '@phosphor-icons/vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import SettingDisabled from '@/components/settings/SettingDisabled.vue'
import BrowseListItem from '@/components/browse/ListItem.vue'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
} from '@/components/ui/table'

const settingsStore = useSettingsStore()
const { browse } = storeToRefs(settingsStore)

const createEmptyArray = (size: number) => {
  const array = []

  for (let i = 0; i < size; i++) {
    array.push('')
  }

  return array
}
</script>

<template>
  <SettingDisabled>
    <Card class="max-w-full">
      <CardHeader>
        <CardTitle class="inline-flex justify-start items-center gap-4">
          Layout
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

              <TransitionGroup name="fade-short-slide">
                <Table v-if="browse.layout == 'list'">
                  <TableBody>
                    <BrowseListItem
                      v-for="(_, index) in createEmptyArray(24)"
                      id="0000"
                      :key="index"
                      name="Example item"
                      type="Movie"
                      :item="{ Name: 'Example title' }"
                    />
                  </TableBody>
                </Table>
                <!-- List display -->
                <div
                  v-if="browse.layout == 'grid'"
                  class="flex w-full justify-center flex-wrap gap-1 pointer-events-none"
                >
                  <BrowseItem
                    v-for="(_, index) in createEmptyArray(24)"
                    id="0000"
                    :key="index"
                    name="Example item"
                    type="Movie"
                    :item="{ Name: 'Example title' }"
                  />
                </div>
              </TransitionGroup>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent class="inline-flex flex-col justify-between gap-3 flex-wrap w-full">
        <div class="inline-flex justify-start flex-col w-full gap-4 items-start">
          <div class="inline-flex w-full flex-wrap justify-between items-center gap-4">
            <h2 class="text-lg">
              Layout
            </h2>
            <p class="text-secondary-foreground/50">
              The layout defines how each item should be displayed, either as a card or list
            </p>
          </div>

          <Select v-model="browse.layout">
            <SelectTrigger>
              <SelectValue :placeholder="browse.layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">
                Grid
              </SelectItem>
              <SelectItem value="list">
                List
              </SelectItem>
            </SelectContent>
          </Select>
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
