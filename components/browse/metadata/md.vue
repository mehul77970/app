<script setup lang="ts">
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
  type DateValue,
} from "@internationalized/date";
import { type Ref, ref } from "vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Calendar } from "@/components/ui/calendar";

import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";

import { Textarea } from "@/components/ui/textarea";

const title = defineModel<string | undefined>("title", { default: "" });
const sortTitle = defineModel<string | undefined>("sortTitle", { default: "" });

const dateCreated = defineModel<string | undefined | null>("dateCreated");
const dateCreatedValue = ref(
  parseDate(
    dateCreated.value
      ? dateCreated.value.split("T")[0]
      : today(getLocalTimeZone()).toString(),
  ),
) as Ref<DateValue>;

const communityRating = defineModel<number | undefined>("communityRating", {
  default: undefined,
});

const year = defineModel<number | undefined>("year", { default: undefined });

const description = defineModel<string | undefined>("description", {
  default: "",
});
</script>

<template>
  <div class="metadata inline-flex flex-col gap-2">
    <h2 class="font-semibold">Metadata</h2>
    <div class="h-[2px] w-full dark:bg-white/5 light:bg-black/25 rounded-lg" />

    <div class="grid grid-cols-4 items-center gap-4">
      <Label for="title" class="text-left"> Title </Label>
      <Input id="title" v-model="title" class="col-span-3" />
    </div>

    <div class="grid grid-cols-4 items-center gap-4">
      <Label for="sortTitle" class="text-left"> Sort Title </Label>
      <Input
        id="sortTitle"
        v-model="sortTitle"
        value="My Sort Title"
        class="col-span-3"
      />
    </div>

    <div class="grid grid-cols-4 items-center gap-4">
      <Label for="dateAdded" class="text-left"> Date Added </Label>
      <Popover>
        <PopoverTrigger as-child>
          <div
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3 select-none"
          >
            {{ dateCreatedValue }}
          </div>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar
            v-model="dateCreatedValue"
            calendar-label="Date Added"
            :min-value="new CalendarDate(1900, 1, 1)"
            :max-value="today(getLocalTimeZone())"
          />
        </PopoverContent>
      </Popover>
    </div>

    <div
      class="grid grid-cols-4 items-center gap-1"
      style="grid-template-columns: 1fr 3fr"
    >
      <Label for="communityRating" class="text-left"> Community Rating </Label>

      <div class="inline-flex grow">
        <NumberField
          id="communityRating"
          v-model="communityRating"
          :min="0"
          :max="10"
          :step="0.1"
          class="w-full"
        >
          <NumberFieldContent class="w-full">
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    </div>
    <div
      class="grid grid-cols-4 items-center gap-1"
      style="grid-template-columns: 1fr 3fr"
    >
      <Label for="year" class="text-left"> Year </Label>

      <div class="inline-flex grow">
        <NumberField
          id="year"
          v-model="year"
          :min="0"
          :max="99999999"
          :text-value="year"
          :step="1"
          class="w-full"
          :format-options="{}"
        >
          <NumberFieldContent class="w-full">
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    </div>
    <div
      class="grid grid-cols-4 items-start gap-2 mt-3"
      style="grid-template-columns: 1fr 3fr"
    >
      <Label for="overview" class="text-left"> Description </Label>

      <Textarea
        v-model="description"
        placeholder="Type your description here..."
        rows="1"
      />
    </div>
  </div>
</template>
