<template>
  <div class="browse-layout flex flex-col p-8 justify-center">
    <div
      class="flex flex-wrap justify-center items-start lg:gap-[240px] gap-24 w-full"
    >
      <div class="sm:min-w-[600px] max-w-full">
        <slot />
      </div>

      <div class="flex flex-col gap-2 max-w-full w-[750px]">
        <slot name="preview" />

        <div class="flex flex-col gap-4 w-fit">
          <slot name="items" />
        </div>

        <div class="chapters min-w-0">
          <slot name="chapters" />
        </div>
      </div>
    </div>
  </div>
</template>
