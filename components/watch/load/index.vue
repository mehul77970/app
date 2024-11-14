<script setup lang="ts">
import { PhPlay } from '@phosphor-icons/vue'
import { animate } from 'motion'

const { name } = defineProps<{ name: string }>()
const model = defineModel<boolean>()

onMounted(() => {
  const loader = animate(
    [
      [
        '#icon',
        {
          opacity: 1,
          x: ['100%', '0%'],
          filter: ['hue-rotate(360deg)', 'hue-rotate(0deg)'],
        },
        { duration: 1, delay: 0 },
      ],
      [
        '#icon',
        { filter: ['hue-rotate(360deg)', 'hue-rotate(0deg)'] },
        { duration: 1.8, delay: -1, easing: 'ease' },
      ],
      [
        '#message',
        { opacity: 1, x: ['-30%', '0%'] },
        { duration: 0.8, delay: -1.5, easing: 'ease-out' },
      ],
      ['#prompt', { opacity: 1, y: 50 }, { duration: 1.2, delay: 0 }],
    ],
    { repeat: 0 },
  )

  loader.then(() => {
    animate(
      [
        [
          '#icon',
          { filter: ['hue-rotate(360deg)', 'hue-rotate(0deg)'] },
          { duration: 5, delay: 0, easing: 'linear' },
        ],
      ],
      { repeat: Infinity },
    )

    console.log('Load finished')
    model.value = true
  })
})
</script>

<template>
  <div
    class="loading-screen flex flex-col w-full justify-center items-center h-full m-auto relative bg-background"
    style="backdrop-filter: blur(8px)"
  >
    <div
      id="logo"
      class="inline-flex flex-row justify-center items-center relative w-full"
    >
      <img
        id="icon"
        src="/shadfin_app_concept.svg"
        class="translate-x-[100%] max-h-[120px] h-[25vw]"
      >

      <h1
        id="message"
        class="lg:text-8xl text-5xl opacity-0 text-white font-semibold my-aut"
      >
        Shadfin
      </h1>
    </div>

    <div
      id="prompt"
      class="lg:text-4xl text-2xl opacity-0 text-white/50 font-light inline-flex justify-center items-center gap-6 flex-wrap"
    >
      <span class="inline"> Now Playing </span>

      <PhPlay
        weight="fill"
        class="h-full"
      />

      <span class="font-semibold">{{ name }}</span>
    </div>
  </div>
</template>
