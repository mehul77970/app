<script setup lang="ts">
import {
  PhArrowsClockwise,
  PhCircleNotch,
  PhGridNine,
  PhList,
  PhSortAscending,
  PhSortDescending,
} from '@phosphor-icons/vue'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import { Table, TableBody } from '@/components/ui/table'

definePageMeta({ layout: 'authenticated' })
const route = useRoute()
const router = useRouter()

const currentPageNum = ref(parseInt((route.query['page'] as string | undefined) ?? '0'))
const swipeContainer = ref()
const itemsPerPage = 20
const startIndex = computed(() => {
  if (currentPageNum.value == 1 || currentPageNum.value == 0) return 0
  return currentPageNum.value * itemsPerPage
})

const mediaBrowser = useMediaBrowserStore()
const settingsStore = useSettingsStore()
const breadcrumbStore = useBreadcrumbStore()

const { browse } = storeToRefs(settingsStore)

const items = ref(
  await mediaBrowser.getItemsOfView(
    route.params.id as string,
    itemsPerPage,
    startIndex.value,
  ),
)

async function fetchItems() {
  return await mediaBrowser.getItemsOfView(route.params.id as string, 50)
}

const viewLoading = ref(false)

async function refreshView() {
  viewLoading.value = true

  items.value = await fetchItems()

  viewLoading.value = false
}
// TODO: Create list item view/Thumbnail item view

breadcrumbStore.setBreadcrumbs([
  {
    name: 'Browse',
  },
])

breadcrumbStore.setPage({
  name: 'View',
})

const setPage = (page: number) => {
  console.log('Setting page to', page)
  router.push({
    name: 'authenticated-browse-id',
    params: { id: route.params.id },
    query: { page: page },
  })
}
</script>

<template>
  <div
    ref="swipeContainer"
    class="flex flex-col w-full min-h-full justify-start items-center lg:px-4 p-4"
  >
    <ClientOnly>
      <BrowseSwipeNavigation
        :current-page-num
        :swipe-container
        :set-page
      />
    </ClientOnly>
    <Teleport to="#pagination">
      <Pagination
        v-model:page="currentPageNum"
        :total="items.TotalRecordCount || 1"
        :sibling-count="1"
        :show-edges="false"
        :default-page="1"
        :items-per-page="itemsPerPage"
        class=""
        @update:page="setPage"
      >
        <PaginationList
          v-slot="{ items }"
          class="fixed bg-background/25 rounded-lg backdrop-blur-lg p-2 bottom-4 right-4 flex items-center gap-1 md:static md:bg-none md:rounded-none "
        >
          <PaginationFirst />
          <PaginationPrev />

          <template
            v-for="(item, index) in items"
            :key="index"
          >
            <PaginationListItem
              v-if="item.type === 'page'"
              :value="item.value"
              as-child
            >
              <Button
                class="w-10 h-10 p-0 link"
                variant="ghost"
                :disabled="currentPageNum === item.value"
              >
                {{ item.value }}
              </Button>
            </PaginationListItem>

            <PaginationEllipsis
              v-else
              :key="item.type"
              :index="index"
            />
          </template>
          <PaginationNext />
          <PaginationLast />
        </PaginationList>
      </Pagination>
    </Teleport>
    <Teleport to="#page-component">
      <div class="inline-flex flex-wrap w-full options rounded-md">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              class="rounded-tr-none rounded-br-none"
            >
              <PhGridNine
                v-if="browse.layout === 'grid'"
                class="size-6"
                weight="fill"
              />
              <PhList
                v-else
                class="size-6"
                weight="bold"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel as-child>
              <NuxtLink
                class="text-primary cursor-pointer hover:underline hover:text-primary/75"
                :to="{ name: 'authenticated-settings-browse' }"
              >
                Item Layout
              </NuxtLink>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              class="align-middle items-center gap-2"
              :checked="browse.layout === 'grid'"
              @click="browse.layout = 'grid'"
            >
              <PhGridNine
                class="size-4"
                weight="fill"
              />
              Grid
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              class="align-middle items-center gap-2"
              :checked="browse.layout === 'list'"
              @click="browse.layout = 'list'"
            >
              <PhList
                class="size-4"
                weight="bold"
              />
              List
            </DropdownMenuCheckboxItem>
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
              <PhSortAscending class="size-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel> Sort </DropdownMenuLabel>
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
    </Teleport>
    <TransitionGroup name="fade-short-left">
      <div
        v-if="browse.layout === 'grid'"
        id="browse-items-grid"
        class="inline-flex max-auto flex-wrap max-w-full justify-center items-stretch overflow-y-auto overflow-x-hidden"
      >
        <LazyBrowseItem
          v-for="(item, index) in items.Items"
          :id="item.Id!!"
          :key="index"
          :name="item.Name!!"
          :data-id="item.Id!!"
          :item
          :data-name="item.Name"
          :data-index="index"
          :type="item.Type"
          :count="item.UserData?.UnplayedItemCount || 0"
        />
      </div>

      <Table v-if="browse.layout === 'list'">
        <TableBody>
          <LazyBrowseListItem
            v-for="(item, index) in items.Items"
            :id="item.Id!!"
            :key="index"
            :name="item.Name!!"
            :item
            :type="item.Type"
            :count="item.UserData?.UnplayedItemCount || 0"
          />
        </TableBody>
      </Table>
    </TransitionGroup>
  </div>
</template>
