<script setup lang="ts">
import { PhPalette } from '@phosphor-icons/vue'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { hexToHSL } from '~/lib/utils'

const changeStyleColor = (v: string, hex: string) => {
  const { h, s, l } = hexToHSL(hex)
  document.documentElement.style.setProperty(v, `${h} ${s}% ${l}%`)
}
</script>

<template>
  <div class="grid gap-6">
    <h2 class="text-2xl font-semibold">
      Theme
    </h2>
    <Card>
      <CardHeader class="flex-row justify-around">
        <div class="inline-flex flex-col justify-center items-center gap-2">
          Background
          <div class="color-swatch">
            <Popover>
              <PopoverTrigger>
                <Button variant="ghost">
                  <div
                    class="h-full w-auto aspect-square bg-background mr-2 rounded-md"
                  />
                  #ff5c3
                </Button>
              </PopoverTrigger>

              <PopoverContent>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#36c3a6')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#36c3a6] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#33aa92')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#33aa92] rounded-md"
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#43d27f')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#43d27f] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#3db770')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#3db770] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#48a3df')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#48a3df] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#3f8dc0')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#3f8dc0] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#ae73c6')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#ae73c6] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#9a56b6')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#9a56b6] rounded-md"
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#f4cb29')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#f4cb29] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#f5a630')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#f5a630] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#eb5d50')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#eb5d50] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#c74c41')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#c74c41] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#e1e9eb')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#e1e9eb] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#c4c9ce')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#c4c9ce] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#51667d')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#51667d] rounded-md"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#394451')"
                >
                  <div
                    class="h-full w-auto aspect-square bg-[#394451] rounded-md"
                  />
                </Button>

                <input
                  id="picker"
                  type="color"
                  class="hidden"
                >
                <Button
                  variant="ghost"
                  size="icon"
                  @click="changeStyleColor('--background', '#394451')"
                >
                  <PhPalette
                    weight="fill"
                    class="h-full w-auto aspect-square text-background"
                  />
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div class="inline-flex flex-col justify-center items-center gap-2">
          Foreground
          <div class="color-swatch">
            <Popover>
              <PopoverTrigger>
                <Button variant="outline">
                  #ff5c3
                </Button>
              </PopoverTrigger>

              <PopoverContent> Swatch data </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Primary Background/Foreground</CardTitle>
      </CardHeader>
      <CardContent
        class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
      />
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Secondary Background/Foreground</CardTitle>
      </CardHeader>
      <CardContent
        class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
      />
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Accent Background/Foreground</CardTitle>
      </CardHeader>
      <CardContent
        class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
      />
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Destructive Background/Foreground</CardTitle>
      </CardHeader>
      <CardContent
        class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
      />
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Info Background/Foreground</CardTitle>
      </CardHeader>
      <CardContent
        class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
      />
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Warning Background/Foreground</CardTitle>
      </CardHeader>
      <CardContent
        class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
      />
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Tooltip/Foreground</CardTitle>
      </CardHeader>
      <CardContent
        class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
      />
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Card</CardTitle>
      </CardHeader>
      <CardContent
        class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
      />
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Border</CardTitle>
      </CardHeader>
      <CardContent
        class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
      />
    </Card>
  </div>
</template>
