<script setup lang="ts">
import Card1 from '~/assets/images/login/card-1.jpg'
import Card2 from '~/assets/images/login/card-2.jpg'
import Card3 from '~/assets/images/login/card-3.jpg'
import Card4 from '~/assets/images/login/card-4.jpg'
import Card5 from '~/assets/images/login/card-5.jpg'

const carousel = [
  {
    src: Card1,
    copyright: 'Watch your favorite content',
  },

  {
    src: Card2,
    copyright: 'Download the Desktop app!',
  },

  {
    src: Card3,
    copyright: 'Stephen King - The Shining',
  },

  {
    src: Card4,
    copyright: 'Amazon Studios - The Grand Tour',
  },

  {
    src: Card5,
    copyright: 'Netflix - Dark',
  },
]

const currentItem = ref(0)

onMounted(() => {
  window.addEventListener('carousel-update', () => {
    if (currentItem.value == carousel.length - 1) {
      currentItem.value = 0
      return
    }

    currentItem.value += 1
  })
})
</script>

<template>
  <div class="relative h-full w-full">
    <!-- Preload images to prevent flash when rotating carousel -->
    <link
      v-for="(item, index) in carousel"
      :key="index"
      rel="prefetch"
      as="image"
      :href="item.src"
    >

    <TransitionGroup name="fade-long">
      <template
        v-for="(item, index) in carousel"
        :key="index"
      >
        <LoginCarosuelItem
          v-if="currentItem == index"
          :src="item.src"
        />

        <div
          v-if="currentItem == index"
          class="hidden lg:flex justify-center items-end absolute bottom-5 right-0 left-0"
        >
          <span>{{ item.copyright }}</span>
        </div>
      </template>
    </TransitionGroup>
  </div>
</template>
