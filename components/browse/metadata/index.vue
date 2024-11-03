<script setup lang="ts">
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const { item } = defineProps<{
  item: BaseItemDto;
}>();

const open = defineModel<boolean>();

const mediaStore = useMediaBrowserStore();
// All metadata inputs
const title = ref(item.Name as string | undefined);
const sortTitle = ref(item.SortName as string | undefined);
const dateCreated = ref(item.DateCreated as string | undefined);
const communityRating = ref(item.CommunityRating as number | undefined);
const year = ref(item.ProductionYear as number | undefined);
const description = ref(item.Overview as string | undefined);

// All parental inputs
const rating = ref(item.OfficialRating as string | undefined);
const customRating = ref(item.CustomRating as string | undefined);

// All attribute inputs
const genres = ref(item.GenreItems?.map((gItem) => gItem.Name) as string[]);
const studios = ref(item.Studios?.map((sItem) => sItem.Name) as string[]);
const tags = ref(item.Tags as string[]);

const saveChanges = async () => {
  const mutatedItem = Object.assign(item, {
    Name: title.value,
    SortTitle: sortTitle.value,
    DateCreated: dateCreated.value,
    CommunityRating: communityRating.value,
    ProductionYear: year.value,
    Overview: description.value,
    OfficialRating: rating.value,
    CustomRating: customRating.value,
    Tags: tags.value,
    Genres: genres.value,
    Studios: studios.value!.flatMap((s) => {
      return { Name: s };
    }),
  });

  await mediaStore.updateItem(mutatedItem);

  open.value = false;
};
</script>

<template>
  <DialogContent class="sm:max-w-[625px] max-h-[100vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Edit Metadata</DialogTitle>
      <DialogDescription>
        Change any metadata of "{{ item.Name }}"
      </DialogDescription>
    </DialogHeader>
    <div class="grid gap-4 py-4">
      <BrowseMetadataStorage :path="item.Path!!" />

      <BrowseMetadataMd
        v-model:title="title"
        v-model:sort-title="sortTitle"
        v-model:date-created="dateCreated"
        v-model:community-rating="communityRating"
        v-model:year="year"
        v-model:description="description"
      />

      <BrowseMetadataParental
        v-model:rating="rating"
        v-model:custom-rating="customRating"
      />

      <BrowseMetadataAttributes
        v-model:genres="genres"
        v-model:studios="studios"
        v-model:tags="tags"
      />
    </div>

    <DialogFooter>
      <Button type="submit" @click="saveChanges"> Save changes </Button>
    </DialogFooter>
  </DialogContent>
</template>
