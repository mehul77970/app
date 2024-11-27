<script setup lang="ts">
definePageMeta({ middleware: 'authenticated', layout: 'authenticated' })

const deviceStore = useDeviceStore()
const router = useRouter()

onMounted(() => {
  window.requestIdleCallback(() => {
    deviceStore.bitrateTest()
  })
  router.afterEach(() => {
    console.log('Should clear error')
    clearError()
  })
})
</script>

<template>
  <NuxtPage />
</template>
