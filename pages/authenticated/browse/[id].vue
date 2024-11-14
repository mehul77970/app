<script setup lang="ts">
import {
  PhArrowsClockwise,
  PhCircleNotch,
  PhGridNine,
  PhList,
  PhSortAscending,
  PhSortDescending,
} from "@phosphor-icons/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody } from "@/components/ui/table";

definePageMeta({ layout: "authenticated" });

const route = useRoute();
const mediaBrowser = useMediaBrowserStore();
const settingsStore = useSettingsStore();

const { browse } = storeToRefs(settingsStore);

const items = ref(
  await mediaBrowser.getItemsOfView(route.params.id as string, 50),
);

async function fetchItems() {
  return await mediaBrowser.getItemsOfView(route.params.id as string, 50);
}

const viewLoading = ref(false);

async function refreshView() {
  viewLoading.value = true;

  items.value = await fetchItems();

  viewLoading.value = false;
}

// TODO: Create list item view/Thumbnail item view
</script>

<template>
  <div
    class="flex flex-col w-full min-h-full justify-center items-center gap-12 lg:p-12 p-4 mt-[72px]"
  >
    <div class="inline-flex flex-wrap options bg-primary-foreground rounded-md">
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
            <PhList v-else class="size-6" weight="bold" />
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
            <PhGridNine class="size-4" weight="fill" />
            Grid
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            class="align-middle items-center gap-2"
            :checked="browse.layout === 'list'"
            @click="browse.layout = 'list'"
          >
            <PhList class="size-4" weight="bold" />
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
            <PhSortAscending class="size-4" weight="bold" />
            Ascending Order
          </DropdownMenuItem>
          <DropdownMenuItem class="align-middle items-center gap-2">
            <PhSortDescending class="size-4" weight="bold" />
            Descending Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <TransitionGroup name="fade-short-left">
      <div
        v-if="browse.layout === 'grid'"
        id="browse-items-grid"
        v-focus-section
        class="inline-flex max-auto flex-wrap max-w-full justify-center items-stretch overflow-y-auto overflow-x-hidden"
      >
        <LazyBrowseItem
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

      <Table v-if="browse.layout === 'list'">
        <TableBody>
          <LazyBrowseListItem
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
        </TableBody>
      </Table>
    </TransitionGroup>
  </div>
</template>
