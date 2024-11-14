<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from "radix-vue";
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  useForwardPropsEmits,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<
  SliderRootProps & { class?: HTMLAttributes["class"] } & { time: number }
>();
const emits = defineEmits<SliderRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
const popoverPosition = ref(0);
const open = ref(false);
function onDrag() {
  open.value = true;
}

function onMouseOver(e: MouseEvent) {
  popoverPosition.value = e.pageX;
}
</script>

<template>
  <SliderRoot
    :class="
      cn(
        'relative flex w-full touch-none select-none items-center',
        props.class,
      )
    "
    v-bind="forwarded"
    @update:model-value="onDrag"
    @mousemove="onMouseOver"
  >
    <SliderTrack
      class="relative h-2 w-full grow overflow-hidden rounded-full bg-transparent"
    >
      <SliderRange class="absolute h-full bg-primary" @mousemove.stop />
    </SliderTrack>
    <SliderThumb
      v-for="(_, key) in modelValue"
      :key="key"
      class="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderRoot>

  <Popover :open="true" z="99">
    <PopoverTrigger>
      <div
        class="w-5 h-5 bg-gray-500 absolute"
        :style="{ left: `${popoverPosition}px` }"
      />
    </PopoverTrigger>
    <PopoverContent> Hello </PopoverContent>
  </Popover>
</template>
