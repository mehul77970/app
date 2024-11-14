<template>
  <div
    class="flex flex-col w-full min-h-full justify-start items-center gap-12"
  >
    <Suspense>
      <NuxtPage />

      <template #fallback>
        <div
          class="fixed w-full h-full flex justify-center items-center backdrop-blur-md"
        >
          <PhCircleNotch class="size-24 animate-spin" weight="bold" />
        </div>
      </template>
    </Suspense>
  </div>
</template>
