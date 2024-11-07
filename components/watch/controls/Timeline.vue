<script setup lang="ts">
import type {
  BaseItemDto,
  TrickplayInfo,
} from '@jellyfin/sdk/lib/generated-client'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { Slider } from '@/components/ui/slider'
import { formatTimestamp } from '@/lib/utils'

const { info } = defineProps<{
  info: BaseItemDto
}>()

const time = ref(0)
const show = ref(true)

const player = usePlayerStore()
const currentTime = computed(() => player.position)
const buffered = computed(() => player.buffer.percent)
const duration = computed(() => player.duration)
const slider = ref(null as null | HTMLElement)
const auth = useAuthenticationStore()
const serverStore = useServerStore()

const offset = ref(0)

const trickplay = ref({
  enabled: false,
  info: null as null | TrickplayInfo,
  offsetX: 0,
  offsetY: 0,
  image: '',
})

let sliderDragging = false

const progress = ref([0])
const tooltip = ref(null as null | HTMLElement)

let sliderLeaveTimeout: undefined | NodeJS.Timeout

const sliderDrag = (position: number[] | undefined) => {
  if (!position || !position[0]) return

  const sliderWidth = document
    .getElementById('slider')!
    .getBoundingClientRect()!.width
  const timeMs = percentToTime(position[0] / 100)

  sliderEntered()
  updateTrickplayTooltip(timeMs)
  calculateTooltipPosition(sliderWidth! * (position[0] / 100))

  sliderDragging = true
  time.value = timeMs
  player.hideControls = false
}

const sliderTimeCommitted = (value: number[]) => {
  const timeMs = percentToTime(value[0] / 100)

  sliderLeft()

  sliderDragging = false
  player.position.value = timeMs / 1000
  player.position.percent = value[0]
  player.positionTimeline = timeMs / 1000
  player.hideControls = true
}

const sliderEntered = () => {
  if (sliderLeaveTimeout) clearTimeout(sliderLeaveTimeout)

  player.hideControls = false
  show.value = true
}

const sliderLeft = () => {
  sliderDragging = false
  sliderLeaveTimeout = setTimeout(() => {
    show.value = false
    player.hideControls = true
  }, 500)
}

const sliderMouseOver = (event: MouseEvent) => {
  const left = document.getElementById('slider')!.getBoundingClientRect()!.left
  const totalWidth = document.getElementById('slider')!.getBoundingClientRect()!
    .width
  const mouseXPos = event.clientX
  const widthPercent = (mouseXPos - left) / totalWidth
  const timeMs = percentToTime(widthPercent)

  updateTrickplayTooltip(timeMs)
  calculateTooltipPosition(event.offsetX)
  player.hideControls = false
  time.value = timeMs
}

watch(currentTime, (time, _) => {
  if (sliderDragging) return

  progress.value = [time.percent]
})

const percentToTime = (width: number) => {
  return (info.RunTimeTicks! * width) / 10000
}

onMounted(() => {
  let lastArrowDown = 0

  // Trickplay is avaliable
  if (info.Trickplay && Object.values(info.Trickplay)[0] != null) {
    const t = Object.values(Object.values(info.Trickplay)[0])[0]

    console.log('Trickplay should be avaliable')
    trickplay.value.enabled = true
    trickplay.value.info = t
  }

  show.value = false
  window.addEventListener('keypress', (key) => {
    console.log('Got key', key.key)
    if (key.key == 'ArrowDown') {
      console.log(
        'Received arrow down event ',
        Date.now() + 350 <= lastArrowDown,
        'last event',
        lastArrowDown,
      )
      if (lastArrowDown != 0 && Date.now() + 350 <= lastArrowDown) {
        console.log('Should focus slider')
        slider.value?.focus()
      }

      lastArrowDown = Date.now()

      setTimeout(() => {
        lastArrowDown = 0
      }, 350)
    }
  })
})

const calculateTooltipPosition = (offsetX: number) => {
  const width = tooltip.value?.getBoundingClientRect()?.width

  if (!width) return

  offset.value = offsetX - width / 2
}

const updateTrickplayTooltip = (milliseconds: number) => {
  const trickplayRaw = trickplay.value
  if (trickplayRaw.enabled) {
    const trickplayInfo = trickplayRaw.info!

    if (!trickplayInfo || !trickplayInfo.Interval) return

    const currentTile = Math.floor(milliseconds / trickplayInfo.Interval)

    const tileSize = trickplayInfo.TileWidth! * trickplayInfo.TileHeight!
    const tileOffset = currentTile % tileSize
    const index = Math.floor(currentTile / tileSize)

    const tileOffsetX = tileOffset % trickplayInfo.TileWidth!
    const tileOffsetY = Math.floor(tileOffset / trickplayInfo.TileWidth!)
    const offsetX = -(tileOffsetX * trickplayInfo.Width!)
    const offsetY = -(tileOffsetY * trickplayInfo.Height!)

    trickplay.value.offsetX = offsetX
    trickplay.value.offsetY = offsetY
    trickplay.value.image = `${serverStore.url}/Videos/${info.Id!}/Trickplay/${trickplayInfo.Width}/${index}.jpg?api_key=${auth._header.authorization}`
  }
}
</script>

<template>
  <div
    id="video-timeline"
    class="relative inline-flex flex-col items-start justify-start w-full"
    @mouseenter="sliderEntered"
    @mouseleave="sliderLeft"
  >
    <div class="inline-flex justify-between items-end w-full">
      <span class="w-[64px] mb-2">{{
        formatTimestamp(currentTime.value * 1000)
      }}</span>

      <div class="inline-flex flex-col justify-center items-center">
        <div
          class="addtional-info w-full inline-flex justify-start items-center absolute"
        >
          <div
            class="h-2 bg-black/50 rounded-lg absolute"
            :style="{ width: buffered + '%' }"
          />
          <div class="w-full h-2 bg-white/25 rounded-lg" />
        </div>

        <div class="h-6 w-[5px] absolute bg-white/25 rounded-lg ml-[20%]" />

        <div class="w-full h-2 absolute" />

        <TooltipProvider>
          <Tooltip
            :delay-duration="0"
            :open="show"
          >
            <TooltipTrigger class="w-full absolute">
              <Slider
                ref="slider"
                v-model="progress"
                :min="0"
                :max="100"
                :step="0.01"
                class="w-full"
                @update:model-value="sliderDrag"
                @value-commit="sliderTimeCommitted"
                @mousemove="sliderMouseOver"
              />
            </TooltipTrigger>

            <TooltipContent
              :align-offset="offset"
              align="start"
              :side-offset="20"
              class="p-0 bg-popover/25 backdrop-blur-xl"
            >
              <div
                id="tooltip"
                ref="tooltip"
                class="relative flex justify-center"
              >
                <div
                  v-if="trickplay.enabled"
                  :style="`width: 320px; height: 180px; background-image: url(${trickplay.image}); background-position-x: ${trickplay.offsetX}px; background-position-y: ${trickplay.offsetY}px`"
                />
                <div
                  class="absolute bottom-2 bg-popover/50 backdrop-blur-md rounded-lg px-3 py-2 font-semibold justify-center text-center"
                >
                  <span>{{ formatTimestamp(time) }}</span>
                </div>
              </div>

              <div
                v-if="!trickplay.enabled"
                class="px-3 py-2 font-semibold"
              >
                {{ formatTimestamp(time) }}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <span class="w-[64px] mb-2">{{
        formatTimestamp(duration)
      }}</span>
    </div>
  </div>
</template>
