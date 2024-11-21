<script setup lang="ts">
import fuzzysearch from 'fuzzysearch-ts'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { cn } from '~/lib/utils'

const currentInput = ref('')

const inputContainsModifier = computed(() => currentInput.value.startsWith('@'))

const filteredInputRaw = computed(() => currentInput.value.replace('@', ''))

const searchFilters = ref([] as Modifier[])
const modifiers = [
  {
    name: 'Type',
    type: 'string',
    class: 'bg-white text-background',
    value: '',
  },
  {
    name: 'Genre',
    type: 'string',
    class: 'bg-gray-500',
    value: '',
  },
  {
    name: 'Quality',
    type: 'string',
    class: 'bg-purple-400',
    value: '',
  },
  {
    name: 'Tag',
    type: 'list',
    class: 'bg-pink-400',
    value: '',
  },
] as Modifier[]

export interface Modifier {
  name: string
  type: ModifierType
  class?: string
  value: string
}

export type ModifierType = 'boolean' | 'string' | 'list'

const validModifiers = computed(() => {
  const filterValue = filteredInputRaw.value.toLowerCase()
  return modifiers.filter(f => fuzzysearch(filterValue, f.name.toLowerCase()))
})

const inputKeyDown = (ev: KeyboardEvent) => {
  if (ev.key === 'Backspace' && currentInput.value === '') {
    searchFilters.value.pop()
  }
  if (ev.key !== 'Enter') return

  if (searchFilters.value[searchFilters.value.length - 1] && !inputContainsModifier.value) {
    searchFilters.value[searchFilters.value.length - 1].value = currentInput.value
    currentInput.value = ''
    displayPicker.value = false
    return
  }
  const currentTag = validModifiers.value[0]
  if (!currentTag) return

  currentInput.value = ''
  displayPicker.value = true
  searchFilters.value.push(currentTag)
}

const displayPicker = ref(false)
</script>

<template>
  <div class="overlay flex w-full justify-center items-center">
    <div class="flex flex-col gap-4 p-4 mt-[72px]">
      <h1>Search Jellyfin</h1>

      <div class="modifier-menu">
        Tags
        {{ inputContainsModifier }}
      </div>
      <Popover :open="inputContainsModifier || displayPicker">
        <PopoverTrigger as-child>
          <div
            class="input-wrapper inline-flex flex-wrap justify-start items-center rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              v-for="(modifier, index) in searchFilters"
              :key="index"
              :class="cn('ml-2 py-1 px-2 text-sm rounded text-foreground w-fit', modifier.class)"
            >{{ modifier.name }}: {{ modifier.value }}</span>
            <input
              v-model="currentInput"
              :class="cn(
                'flex h-10 flex-grow-1 bg-background border-none px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent focus-visible:border-none focus-visible:outline-none file:text-sm file:font-medium placeholder:text-muted-foreground ',
              )
              "
              @keydown="inputKeyDown"
            >
          </div>
        </PopoverTrigger>
        <PopoverContent class="w-inherit inline-flex flex-col gap-2">
          <div
            v-if="!displayPicker"
            class="selectors w-inherit inline-flex flex-col gap-2"
          >
            <h2 class="text-white/85">
              Modifiers
            </h2>

            <div class="inline-flex flex-col gap-1">
              <span
                v-for="(modifier, index) in validModifiers"
                :key="index"
                :class="cn('py-1 px-2 text-sm rounded text-foreground w-fit', modifier.class)"
              >{{ modifier.name }}</span>
              <!-- <span class="py-1 px-2 text-sm rounded bg-purple-400 text-foreground w-fit">Quality</span>
            <span class="py-1 px-2 text-sm rounded bg-pink-400 text-foreground w-fit">Tag</span> -->
            </div>
          </div>

          <div
            v-if="displayPicker"
            class="inline-flex flex-col gap-1"
          >
            <h2>Select a genre</h2>

            <span class="py-1 px-2 text-sm rounded text-foreground w-fit">Horror</span>
            <span class="py-1 px-2 text-sm rounded text-foreground w-fit">Romance</span>
            <span class="py-1 px-2 text-sm rounded text-foreground w-fit">Fantasy</span>
            <span class="py-1 px-2 text-sm rounded text-foreground w-fit">Slice-of-Life</span>
          </div>
        </PopoverContent>
      </Popover>

      <div class="inline-flex w-full">
        Options
      </div>

      <div class="query-results">
        Results
      </div>
    </div>
  </div>
</template>
