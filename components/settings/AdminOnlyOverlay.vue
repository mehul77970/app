<script setup lang="ts">
import { PhShieldSlash } from '@phosphor-icons/vue'

const userStore = useUserStore()

const admin = computed(() => userStore.user?.Policy?.IsAdministrator)
</script>

<template>
  <div class="relative">
    <div
      v-if="!admin"
      class="absolute z-[2] w-full h-full inline-flex flex-col gap-2 text-yellow-500 cursor-not-allowed text-center break-all select-none justify-center items-center backdrop-blur-sm backdrop-saturate-50"
    >
      <PhShieldSlash
        class="size-12"
        weight="duotone"
      />
      This content is only avaliable for administrators
    </div>

    <slot />
  </div>
</template>
