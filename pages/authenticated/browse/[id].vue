<script setup lang="ts">
import { PhArrowsClockwise, PhCircleNotch, PhGridNine, PhList, PhSortAscending, PhSortDescending } from '@phosphor-icons/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

definePageMeta({ layout: 'authenticated' })

const route = useRoute()
const mediaBrowser = useMediaBrowserStore()

const fetchItems = async () => {
  return await mediaBrowser.getItemsOfView(route.params.id as string, 50)
}

const items = ref(await fetchItems())

const viewLoading = ref(false)

const refreshView = async () => {
  viewLoading.value = true

  items.value = await fetchItems()

  viewLoading.value = false
}

// TODO: Create list item view/Thumbnail item view
</script>

<template>
  <div class="flex flex-col w-full min-h-full justify-center items-center p-3 lg:p-8 gap-12 mt-[72px]">
    <div class="inline-flex flex-wrap options bg-primary-foreground rounded-md">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            size="icon"
            variant="ghost"
            class="rounded-tr-none rounded-br-none"
          >
            <PhGridNine
              class="size-6"
              weight="fill"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            Item Display
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="align-middle items-center gap-2">
            <PhGridNine
              class="size-4"
              weight="fill"
            />
            Grid
          </DropdownMenuItem>
          <DropdownMenuItem class="align-middle items-center gap-2">
            <PhList
              class="size-4"
              weight="bold"
            />
            List
          </DropdownMenuItem>
          <DropdownMenuItem class="align-middle items-center gap-2">
            <PhGridNine
              class="size-4"
              weight="fill"
            />
            Thumbnail
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        size="icon"
        variant="ghost"
        class="rounded-t-none rounded-b-none group relative"
        :disabled="viewLoading"
        @click="refreshView"
      >
        <PhCircleNotch
          v-if="viewLoading"
          class="size-6 animate-spin absolute"
        />
        <PhArrowsClockwise
          v-else
          class="size-6 group-hover:rotate-[10deg] duration-250 ease transition-all absolute"
        />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            size="icon"
            variant="ghost"
            class="rounded-tl-none rounded-bl-none"
          >
            <PhSortAscending
              class="size-6"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            Sort
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="align-middle items-center gap-2">
            <PhSortAscending
              class="size-4"
              weight="bold"
            />
            Ascending Order
          </DropdownMenuItem>
          <DropdownMenuItem class="align-middle items-center gap-2">
            <PhSortDescending
              class="size-4"
              weight="bold"
            />
            Descending Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div
      id="browse-items"
      v-focus-section
      class="inline-flex flex-wrap max-w-full justify-center items-center overflow-y-auto"
    >
      <BrowseItem
        v-for="(item, index) in items"
        :id="item.Id!!"
        :key="index"
        v-focus
        :name="item.Name!!"
        :data-id="item.Id!!"
        :item
        :data-name="item.Name"
        :data-index="index"
        :type="item.Type"
        :count="item.UserData?.UnplayedItemCount || 0"
      />
    </div>
  </div>
</template>
