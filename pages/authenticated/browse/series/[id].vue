<script setup lang="ts">
definePageMeta({ layout: 'authenticated' })

const route = useRoute()

const seriesID = route.params.id! as string
</script>

<template>
  <BrowseSeries :id="seriesID" />
</template>
