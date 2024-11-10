<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const serverStore = useServerStore()

const error = ref(null as Error | null)
const loading = ref(false)

const restart = async () => {
  try {
    await serverStore.restartServer()

    loading.value = true

    setInterval(async () => {
      try {
        await serverStore.testServerURL(serverStore.url)

        location.href = '/authenticated/settings'
      }
      catch {
        return
      }
    }, 5000)
  }
  catch (e: unknown) {
    error.value = e as Error
    loading.value = false
  }
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button
        variant="outline"
        class="flex-grow"
      >
        Restart
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to restart?</AlertDialogTitle>
        <AlertDialogDescription>
          Restarting Jellyfin will cause all active clients to lose
          connection.<br>
          <Alert
            v-if="loading"
            class="w-full mt-4"
          >
            <AlertTitle class="font-semibold">
              Restarting Jellyfin Server...
            </AlertTitle>
            <AlertDescription>
              This page will automatically reload when the server has restarted.
            </AlertDescription>
          </Alert>
          <Alert
            v-if="error"
            variant="destructive"
            class="w-full mt-4"
          >
            <AlertTitle>An error occured when trying to restart.</AlertTitle>
            <AlertDescription>
              {{ error.message }}
            </AlertDescription>
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
          @click="restart"
        >
          <span v-if="!loading">Restart</span>
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
