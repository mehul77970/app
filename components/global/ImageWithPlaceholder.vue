<script setup lang="ts">
const { src, className } = defineProps<{
  src: string
  className: string | []
}>()

const img = ref(null as HTMLImageElement | null)
const display = ref(false)

const onPrimaryImageLoaded = () => {
  display.value = true
}

onMounted(() => {
  if (!img.value) return

  // Image was loaded from browser cache
  if (!img.value.complete) return

  display.value = true
})
</script>

<template>
  <Transition name="fade-long">
    <img
      v-show="display"
      ref="img"
      :src
      :class="className"
      @load="onPrimaryImageLoaded"
    >
  </Transition>

  <img
    v-show="!display"
    src="/placeholder.svg"
    :class="className"
  >
</template>
