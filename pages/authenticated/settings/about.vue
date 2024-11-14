<script setup lang="ts">
import { PhHeart } from "@phosphor-icons/vue";
import license from "~/LICENSE.txt?raw";
import pkg from "~/package.json";
</script>

<template>
  <div class="grid gap-6">
    <div
      class="welcome inline-flex flex-col gap-4 items-center justify-center w-full"
    >
      <img src="~/public/shadfin_concept_vertical.svg" class="h-[256px]" />

      <h1 class="text-2xl font-semibold">
        {{ pkg.version }}
      </h1>

      <div class="details inline-flex flex-col gap-4 text-white/50">
        <div class="inline-flex flex-wrap gap-3 flex-col">
          <h2 class="text-xl font-semibold text-white/75">Powered by</h2>
          <div class="inline-flex gap-2 flex-wrap">
            <div
              v-for="(version, name) in pkg.dependencies"
              :key="name"
              class="package"
            >
              {{ name }}
            </div>
          </div>
        </div>

        <div class="inline-flex flex-col gap-3">
          <h2 class="text-xl font-semibold text-white/75">And...</h2>
          <div class="inline-flex gap-2 flex-wrap">
            <div
              v-for="(version, name) in pkg.devDependencies"
              :key="name"
              class="package"
            >
              {{ name }}
            </div>
          </div>
        </div>

        <div class="inline-flex flex-wrap gap-3 flex-col">
          <h2 class="text-xl font-semibold text-white/75">Inspired By</h2>
          <div class="inline-flex gap-2 flex-wrap">
            <span>Jellyfin</span>
            <span>Jellyfin (Vue)</span>
            <span>Streamyfin</span>
            <span>Findroid</span>
            <span>Jellyflix</span>
            <span>And more...</span>
          </div>
        </div>

        <div class="inline-flex flex-wrap gap-3 flex-col">
          <h2 class="text-xl font-semibold text-white/75">Supported By</h2>
          <div class="inline-flex gap-2 flex-wrap">
            <span>You, Thank you.</span>
          </div>
        </div>

        <div class="inline-flex flex-wrap gap-3 flex-col">
          <h2 class="text-xl font-semibold text-white/75">Licensed Under</h2>
          <div class="inline-flex gap-2 flex-wrap overflow-none">
            <pre class="whitespace-pre-wrap">{{ license }}</pre>
          </div>
        </div>
        <div class="inline-flex gap-2 items-center text-white/75 font-semibold">
          <PhHeart weight="fill" class="text-red-400" :size="24" />
          <span>From Brys with love.</span>
        </div>
      </div>
    </div>
  </div>
</template>
