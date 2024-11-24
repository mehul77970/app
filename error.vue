<script lang="ts" setup>
import type { NuxtError } from '#app'
import { Button } from '@/components/ui/button'

const { error = { message: 'No error encountered' } } = defineProps({
  error: Object as () => NuxtError,
})

const l = useLoggerStore()

function refresh() {
  clearError({ redirect: '/' })
}

function clearAndRefresh() {
  const auth = useAuthenticationStore()
  const user = useUserStore()

  auth._header.authorization = null
  auth.loggedIn = false

  user.user = null

  refresh()
}

onMounted(() => {
  // throw error
})
</script>

<template>
  <div
    class="w-full h-[100vh] overflow-hidden justify-center items-center flex flex-col"
  >
    <h1 class="font-bold text-4xl text-red-500 text-center">
      An error occurred<br>Oh noes :c
    </h1>
    <p class="font-semibold text-lg mt-4">
      {{ error.message }}
    </p>
    <div class="flex flex-col gap-2 font-semibold mt-8">
      <Button
        size="lg"
        @click="refresh"
      >
        Refresh Page
      </Button>
      <Button
        variant="destructive"
        size="lg"
        @click="clearAndRefresh"
      >
        Clear User Data & Refresh
      </Button>
    </div>
  </div>
</template>
