<script lang="ts" setup>
import type { NuxtError } from '#app'

const { error = { message: 'No error encountered' } } = defineProps({
  error: Object as () => NuxtError,
})

onMounted(() => {
  document.body.style.backgroundColor = '#180909'
})
</script>

<template>
  <div
    class="h-[100vh] w-[75%] max-w-[850px] overflow-hidden m-auto justify-center items-start flex flex-col"
  >
    <div class="inline-flex flex-row items-end w-full justify-between gap-4 flex-wrap ">
      <div>
        <h1 class="md:text-6xl text-4xl font-bold text-red-500">
          {{
            /* @ts-expect-error Generic Error */
            error.statusCode
          }}
        </h1>
        <h2 class="md:text-4xl text-2xl font-bold text-red-500">
          {{ error.message }}
        </h2>
      </div>

      <img
        src="/shadfin_app_concept.svg"
        class="size-24"
        alt="Shadfin Logo"
      >
    </div>

    <p class="mt-6 text-lg text-orange-400 font-semibold">
      {{
        /* @ts-expect-error Generic Error */
        error.data
      }}
    </p>
    <p
      class="text-lg mt-4 text-orange-400 font-light font-mono"
      v-html="error.stack"
    />
  </div>
</template>
