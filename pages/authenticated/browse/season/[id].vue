<script setup lang="ts">
definePageMeta({ layout: 'authenticated' })

const route = useRoute()

const season = route.params.id! as string
const parent = route.query.parent! as string
</script>

<template>
  <BrowseSeason
    :id="season"
    :parent-id="parent"
  />
</template>
