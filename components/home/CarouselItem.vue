<script setup lang="ts">
const { name = 'N/A', id = '???' } = defineProps<{
  name?: string
  id?: string
  type?: string
}>()

const mediaBrowserStore = useMediaBrowserStore()
const imagePreviewsOfView = ref([] as string[])

const currentItem = ref(0)

const items = await mediaBrowserStore.getItemsOfView(id)

for (let itm = 0; items.length > itm; itm++) {
  const item = items[itm]

  if (item!.ImageTags!['Primary']) {
    imagePreviewsOfView.value.push(item.Id!)
  }
}

onMounted(() => {
  window.addEventListener('carousel-update', () => {
    if (currentItem.value == imagePreviewsOfView.value.length - 1) {
      currentItem.value = 0
      return
    }

    currentItem.value += 1
  })
})
</script>

<template>
  <NuxtLink
    v-focus
    :to="{ name: 'authenticated-browse-id', params: { id } }"
    class="group"
  >
    <div
      class="p-1 flex flex-row gap-4 h-[200px] w-[130px] lg:h-[350px] lg:w-[230px]"
    >
      <div
        class="flex flex-col flex-grow-1 justify-start items-center w-full h-full relative rounded-md"
      >
        <TransitionGroup name="fade-long">
          <template
            v-for="(item, index) in imagePreviewsOfView"
            :key="index"
          >
            <img
              v-if="currentItem == index"
              :src="
                mediaBrowserStore.generateImageURL(
                  item,
                  undefined,
                  130,
                  200,
                  50,
                )
              "
              class="absolute object-cover w-full h-full rounded-md"
            >
          </template>
        </TransitionGroup>

        <div
          class="flex justify-center items-center absolute w-full h-full font-bold lg:text-xl text-xl backdrop backdrop-blur-[4px] rounded-md backdrop-saturate-[25%] transition-all text-white duration-250 group-hover:text-opacity-0 group-hover:backdrop-blur-[0px] group-hover:backdrop-saturate-100 group-focus-within:text-opacity-0 group-focus-within:backdrop-blur-[0px] group-focus-within:backdrop-saturate-100 selectable cursor-pointer"
        >
          <span class="text-center">{{ name }}</span>
        </div>

        <div
          class="w-[20%] h-1 bg-transparent absolute top-2 z-5 transition-all duration-250 rounded-lg group-hover:bg-white/50 group-focus-within:bg-white/50"
        />
      </div>
    </div>
  </NuxtLink>
</template>
