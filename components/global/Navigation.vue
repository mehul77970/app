<script setup lang="ts">
import { PhHouse, PhList, PhMagnifyingGlass } from '@phosphor-icons/vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const userStore = useUserStore()
const mediaStore = useMediaBrowserStore()
const router = useRouter()

const user = computed(() => userStore.user)

const views = computed(() => mediaStore.views)

const currentRoute = computed(() => router.currentRoute)

mediaStore.getUserViews()

userStore.getUser()
</script>

<template>
  <div
    v-if="currentRoute?.value?.name !== 'authenticated-new-watch-id'"
    class="fixed z-[5] flex min-w-[90%] bg-[#10121385] backdrop-blur-sm backdrop-saturate-150 mt-3 rounded-xl items-center justify-start py-3 px-8 gap-4 opacity-0 animate-out fill-mode-forwards duration-500 ease"
  >
    <!-- <div class="inline-flex justify-between items-center w-[95%] dark:bg-white/10 rounded-lg px-3 py-2 gap-2"> -->
    <NuxtLink
      :to="{ name: 'authenticated' }"
      class="md:inline-flex justify-center items-center group hidden"
    >
      <Button
        variant="ghost"
        size="icon"
      >
        <PhHouse
          :size="24"
          :weight="
            router.currentRoute.value.fullPath === '/' ? 'fill' : 'regular'
          "
        />
      </Button>
    </NuxtLink>

    <Drawer>
      <DrawerTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="inline-flex justify-center items-center group md:hidden"
        >
          <PhList class="size-24" />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <div class="p-4 pb-0">
          <div class="flex flex-col items-start justify-center">
            <DrawerClose as-child>
              <NuxtLink
                :to="{ name: 'authenticated' }"
                class="inline-flex justify-start items-start group"
              >
                <Button variant="ghost">
                  <div class="inline-flex flex-col gap-[4px]">
                    <span>Home</span>
                  </div>
                </Button>
              </NuxtLink>
            </DrawerClose>

            <NuxtLink
              v-for="(view, index) in views"
              :key="index"
              :to="{ name: 'authenticated-browse-id', params: { id: view.Id } }"
              class="inline-flex justify-start items-start group"
            >
              <DrawerClose as-child>
                <Button variant="ghost">
                  <div class="inline-flex flex-col gap-[4px]">
                    <span>{{ view.Name }}</span>

                    <div
                      v-if="
                        currentRoute.value.name === `authenticated-browse-id`
                          && currentRoute.value.params.id === view.Id
                      "
                      class="bg-white/25 h-[3px] w-full rounded-lg"
                    />
                  </div>
                </Button>
              </DrawerClose>
            </NuxtLink>
          </div>
        </div>
      </DrawerContent>
    </Drawer>

    <div
      class="md:inline-flex items-center justify-start flex-grow gap-2 hidden"
    >
      <NuxtLink
        v-for="(view, index) in views"
        :key="index"
        :to="{ name: 'authenticated-browse-id', params: { id: view.Id } }"
        class="inline-flex justify-center items-center group"
      >
        <Button variant="ghost">
          <div class="inline-flex flex-col gap-[4px]">
            <span>{{ view.Name }}</span>

            <div
              v-if="
                currentRoute.value.name === `authenticated-browse-id`
                  && currentRoute.value.params.id === view.Id
              "
              class="bg-white/25 h-[3px] w-full rounded-lg"
            />
          </div>
        </Button>
      </NuxtLink>
    </div>

    <div class="inline-flex gap-8 items-center ml-auto">
      <!-- Global Search -->
      <div
        v-if="false"
        class="search"
      >
        <PhMagnifyingGlass
          :size="24"
          weight="fill"
        />
      </div>

      <ClientOnly>
        <NuxtLink
          :to="{ name: 'authenticated-settings' }"
          class="inline-flex justify-center items-center"
        >
          <Avatar>
            <AvatarImage
              v-if="user && user.PrimaryImageTag"
              :src="userStore.getUserImage(64)!!"
              alt="user-avatar"
            />
            <AvatarFallback v-else-if="user?.Name">
              {{ user ? user.Name[0] : "NA" }}
            </AvatarFallback>
          </Avatar>
        </NuxtLink>
      </ClientOnly>
    </div>
  </div>
</template>
