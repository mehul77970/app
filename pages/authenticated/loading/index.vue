<script setup lang="ts">
import { PhPlay } from "@phosphor-icons/vue";
import { timeline, spring } from "motion";

const model = defineModel<boolean>();

onMounted(() => {
  const audio = new Audio("/flix.mp3");

  audio.play();
  const loader = timeline(
    [
      [
        "#icon",
        { opacity: 1, x: ["100%", "0%"] },
        { duration: 0.5, delay: 0.17, easing: spring() },
      ],
      [
        "#message",
        { opacity: 1, x: ["-30%", "0%"] },
        { duration: 0.5, delay: -0.6, easing: spring() },
      ],
      [
        "#icon",
        { filter: ["hue-rotate(80deg)", "hue-rotate(360deg)"] },
        { duration: 3, delay: -1, easing: "linear" },
      ],
      ["#prompt", { opacity: 1, y: 50 }, { duration: 2, delay: -3 }],
    ],
    { repeat: 0 },
  );

  loader.finished.then(() => {
    timeline(
      [
        [
          "#icon",
          { filter: ["hue-rotate(360deg)", "hue-rotate(0deg)"] },
          { duration: 5, delay: 0, easing: "linear" },
        ],
      ],
      { repeat: Infinity },
    );

    console.log("Load finished");
    model.value = true;
  });
});
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
        src="/logo_rough.svg"
        class="translate-x-[100%] max-h-[220px] h-[25vw]"
      />

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

      <PhPlay weight="fill" class="h-full" />

      <span class="font-semibold">Testing</span>
    </div>
  </div>
</template>
