<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import langs from "~/assets/json/langs.json";

const open = ref(false);
const value = ref("");
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        role="combobox"
        :aria-expanded="open"
        class="w-[250px] max-w-full justify-start"
      >
        {{
          value
            ? langs.find((lang) => lang.name === value)?.name
            : "Select a language"
        }}
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="w-[250px] max-w-full p-0"
      align="center"
      side="bottom"
    >
      <Command>
        <CommandInput class="h-9" placeholder="Search language..." />
        <CommandEmpty>No language found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="language in langs"
              :key="language.code"
              :value="language.name"
              @select="
                (ev) => {
                  if (typeof ev.detail.value === 'string') {
                    value = ev.detail.value;
                  }
                  open = false;
                }
              "
            >
              {{ language.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
