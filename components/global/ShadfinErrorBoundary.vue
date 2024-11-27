<script setup lang="ts">
import { PhWarning } from '@phosphor-icons/vue'

const router = useRouter()

const clearErrorAndNavigateBack = (error: Ref<unknown>) => {
  router.go(-1)
  error.value = null
}
</script>

<template>
  <NuxtErrorBoundary>
    <slot />
    <template #error="{ error }">
      <div class="flex flex-col items-center justify-center w-full absolute h-full p-4">
        <Alert
          class="w-[800px] max-w-full border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
        >
          <PhWarning
            class="size-6"
            weight="fill"
          />
          <AlertTitle class="inline-flex gap-2 justify-center items-center ml-3">
            An error occurred when loading that page.
          </AlertTitle>

          <AlertDescription class="ml-3 break-all">
            {{ error }}
          </AlertDescription>
        </Alert>
        <div class="inline-flex justify-center w-fit mt-4 items-center">
          <Button
            class="w-full"
            variant="outline"
            @click="clearErrorAndNavigateBack(error)"
          >
            Go Back
          </Button>
        </div>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>
