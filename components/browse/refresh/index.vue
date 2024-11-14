<script setup lang="ts">
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RefreshType } from "~/stores/MediaBrowserStore";

const { item } = defineProps<{
  item: BaseItemDto;
}>();

const open = defineModel<boolean>();

const mediaStore = useMediaBrowserStore();

const refreshMode = ref("Default" as RefreshType);
const refreshSwitches = ref({
  replace: false,
  replace_images: false,
  recursive: true,
});

async function refreshContent() {
  const refreshSwitch = refreshSwitches.value;

  await mediaStore.refreshItem(item.Id!, refreshMode.value, {
    recursive: refreshSwitch.recursive,
    replace_all: refreshSwitch.replace,
    replace_images: refreshSwitch.replace_images,
  });

  open.value = false;
}
</script>

<template>
  <DialogContent class="sm:max-w-[625px] max-h-[100vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Refresh Metadata</DialogTitle>
      <DialogDescription>
        Refresh metadata for "{{ item.Name }}"
      </DialogDescription>
    </DialogHeader>
    <div class="grid gap-2 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="path" class="text-left"> Refresh Mode </Label>
        <Select v-model="refreshMode">
          <SelectTrigger class="col-span-3">
            <SelectValue :placeholder="refreshMode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Default">
              Scan for new and updated files
            </SelectItem>
            <SelectItem value="ValidationOnly">
              Search for missing metadata
            </SelectItem>
            <SelectItem value="FullRefresh"> Replace all metadata </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="inline-flex justify-between w-full">
        <div class="inline-flex items-center gap-4">
          <Label for="path" class="text-left"> Recursive </Label>
          <Checkbox v-model:checked="refreshSwitches.recursive" />
        </div>
        <div class="inline-flex items-center gap-4">
          <Label for="path" class="text-left"> Replace All Metadata </Label>
          <Checkbox v-model:checked="refreshSwitches.replace" />
        </div>

        <div class="inline-flex items-center gap-4">
          <Label for="path" class="text-left"> Replace All Images </Label>
          <Checkbox v-model:checked="refreshSwitches.replace_images" />
        </div>
      </div>
    </div>

    <DialogFooter>
      <Button type="submit" @click="refreshContent"> Refresh Content </Button>
    </DialogFooter>
  </DialogContent>
</template>
