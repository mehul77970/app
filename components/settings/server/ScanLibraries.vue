<script setup lang="ts">
import type { ScheduledTasksInfoMessage } from '@jellyfin/sdk/lib/generated-client'
import { notify } from 'notiwind'
import Radial from '~/components/ui/radial/Radial.vue'
import type { ApiFetchError } from '~/composables/useApiFetch'

const socket = useSocketStore()
const server = useServerStore()
const progress = ref(undefined as number | undefined)

const scanAllLibraries = async () => {
  console.log('Attempting to connect to socket')
  socket.connectToSocket()
  socket.bus.on('ScheduledTasksInfo', (data: ScheduledTasksInfoMessage) => {
    const scan = data.Data?.find(
      task => task.Id == ScheduledTasks.GLOBAL_SCAN,
    )
    const percent = scan?.CurrentProgressPercentage

    if (percent == undefined) {
      socket.disconnectSocket()
    }
    progress.value = percent || 0
  })

  try {
    await server.scanAllLibraries()
    progress.value = 1
  }
  catch (e: unknown) {
    progress.value = undefined
    notify(
      {
        title: 'Unable to scan libraries',
        type: 'error',
        text: (e as ApiFetchError),
        group: 'bottom',
      },
      5000,
    )

    socket.disconnectSocket()
  }
}
</script>

<template>
  <div class="relative w-full inline-flex justify-center items-center">
    <Button
      variant="secondary"
      class="w-full"
      :disabled="progress"
      @click="scanAllLibraries"
    >
      Scan All Libraries
    </Button>

    <Transition name="fade-short">
      <div
        v-if="progress"
        class="absolute z-[3] inline-flex justify-center items-center w-full h-full top-0 bg-black/15 rounded-[0.5rem] backdrop-blur-sm"
      >
        <Radial
          :max="100"
          :min="0"
          :value="progress"
          class-name="size-7 ml-2"
          gauge-primary-color="#00A4DC"
          gauge-secondary-color="rgba(0, 0, 0, 0.5)"
          :show-complete="true"
        />
      </div>
    </Transition>
  </div>
</template>
