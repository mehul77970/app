<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue'
import type { ApiFetchError } from '@/composables/useApiFetch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const serverStore = useServerStore()

const error = ref(null as ApiFetchError | null)
const shutdownState = ref(false as boolean)
const loading = ref(false)

async function shutdown() {
  try {
    loading.value = true
    await serverStore.shutdownServer()

    shutdownState.value = true
    loading.value = false
  }
  catch (e: unknown) {
    error.value = e as ApiFetchError
    loading.value = false
  }
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button
        variant="error"
        class="flex-grow"
      >
        Shutdown
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to shutdown?</AlertDialogTitle>
        <AlertDialogDescription>
          Shutting down will cause all clients to become unresponsive, and you
          will be unable to communicate with the server<br>
          <Alert
            v-if="loading"
            class="w-full mt-4"
          >
            <AlertTitle class="font-semibold">
              Shutting down Jellyfin Server...
            </AlertTitle>
          </Alert>
          <Alert
            v-if="error"
            variant="destructive"
            class="w-full mt-4"
          >
            <AlertTitle>An error occured when trying to shutdown.</AlertTitle>
            <AlertDescription>
              {{ error }}
            </AlertDescription>
          </Alert>

          <Alert
            v-if="shutdownState"
            variant="destructive"
            class="w-full mt-4"
          >
            <AlertTitle>
              Jellyfin Server has been succesfully shutdown
            </AlertTitle>
          </Alert>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="loading">
          Cancel
        </AlertDialogCancel>

        <Button
          variant="destructive"
          :disabled="loading"
          @click="shutdown"
        >
          <span v-if="!loading">Shutdown</span>
          <PhCircleNotch
            v-else
            :size="24"
            class="animate-spin"
          />
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
