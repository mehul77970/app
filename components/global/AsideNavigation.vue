<script setup lang=ts>
import {
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  Settings2,
} from 'lucide-vue-next'
import { PhHouse, PhBooks, PhFilmReel, PhCassetteTape, PhTelevisionSimple, PhImageSquare, PhCarProfile, PhPencil, PhPencilSimple } from '@phosphor-icons/vue'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const userStore = useUserStore()
const mediaStore = useMediaBrowserStore()
const crumbStore = useBreadcrumbStore()
const settingsStore = useSettingsStore()
const log = useLoggerStore()
const router = useRouter()

const user = computed(() => userStore.user)
const views = computed(() => mediaStore.views)

const crumbs = computed(() => crumbStore.crumbs)
const pageCrumb = computed(() => crumbStore.page)

const sidebarVisible = computed(() => !settingsStore.hideSidebar)
const data = {
  navMain: [
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: 'authenticated-settings',
        },
        {
          title: 'Browse',
          url: 'authenticated-settings-browse',
        },
        {
          title: 'Player',
          url: 'authenticated-settings-player',
        },
        {
          title: 'Theme',
          url: 'authenticated-settings-theme',
        },
        {
          title: 'About',
          url: 'authenticated-settings-about',
        },
      ],
    },
  ],
}

onMounted(() => {
  document.addEventListener('keydown', (ev) => {
    if (!ev.ctrlKey) return

    ev.preventDefault()
    ev.stopPropagation()

    switch (ev.key) {
      // Shortcut to log-out user
      case 'l':
        log.$log({ message: 'Goodbye!' })
        logout()
        break
    }
  })
})

const nuxtApp = useNuxtApp()
const loading = ref(false)
nuxtApp.hook('page:start', () => {
  loading.value = true
})
nuxtApp.hook('page:finish', () => {
  loading.value = false
})

mediaStore.getUserViews()

userStore.getUser()

const logout = () => {
  router.push({ path: '/authenticated/logout' })
}
</script>

<template>
  <SidebarProvider>
    <Sidebar
      v-if="sidebarVisible"
      collapsible="icon"
    >
      <div
        class="load-wrapper px-2 py-1 w-full h-[4px] animate-pulse"
      >
        <div
          v-if="loading"
          class="w-full h-[3px] bg-primary rounded-md"
        />
      </div>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage
                      v-if="user && user.PrimaryImageTag"
                      :src="userStore.getUserImage(64)!!"
                      alt="user-avatar"
                    />
                    <AvatarFallback class="rounded-lg" />
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ user?.Name }}</span>
                    <span class="truncate text-xs">{{ user?.Id }}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    class="ml-auto"
                  >
                    <ChevronsUpDown class="size-4" />
                  </Button>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                :side-offset="4"
              >
                <DropdownMenuLabel class="text-xs text-muted-foreground">
                  Quick Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <div class="flex size-6 items-center justify-center rounded-sm border mr-2">
                    <PhPencilSimple weight="fill" />
                  </div>
                  Change Avatar
                </DropdownMenuItem>
                <DropdownMenuItem @click="logout">
                  <div class="flex size-6 items-center justify-center rounded-sm border mr-2">
                    <LogOut />
                  </div>
                  Log out
                  <DropdownMenuShortcut>Ctrl+L</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>App</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <PhHouse weight="duotone">
                  eee
                </PhHouse>
                <NavigationLink :to="{ name: 'authenticated' }">
                  Home
                </NavigationLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Collapsible
              v-for="item in data.navMain"
              :key="item.title"
              as-child
              :default-open="item?.isActive"
              class="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger as-child>
                  <SidebarMenuButton :tooltip="item.title">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                    <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem
                      v-for="subItem in item.items"
                      :key="subItem.title"
                    >
                      <SidebarMenuSubButton as-child>
                        <NuxtLink :to="{ name: subItem.url }">
                          <span>{{ subItem.title }}</span>
                        </NuxtLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="(view, index) in views"
              :key="index"
            >
              <SidebarMenuButton
                :tooltip="view.Name || ''"
                as-child
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <NavigationLink :to="{ name: `authenticated-browse-id`, params: { id: view.Id } }">
                  <PhFilmReel
                    v-if="view.CollectionType === 'movies'"
                    weight="fill"
                  />
                  <PhTelevisionSimple
                    v-else-if="view.CollectionType === 'tvshows'"
                    weight="fill"
                  />
                  <PhCassetteTape
                    v-else-if="view.CollectionType === 'music'"
                    weight="fill"
                  />
                  <PhBooks
                    v-else-if="view.CollectionType === 'books'"
                    weight="fill"
                  />
                  <PhImageSquare
                    v-else
                    weight="fill"
                  />
                  <span>{{ view.Name }}</span>
                </NavigationLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    <SidebarInset class="overflow-hidden">
      <header
        v-if="sidebarVisible"
        class="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] z-[5] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator
            orientation="vertical"
            class="mr-2 h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <template
                v-for="(crumb, index) in crumbs"
                :key="index"
              >
                <BreadcrumbItem
                  class="hidden md:block"
                >
                  <BreadcrumbLink
                    as-child
                  >
                    <NuxtLink :to="{ path: crumb?.path || '' }">
                      {{ crumb.name }}
                    </NuxtLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class="hidden md:block" />
              </template>

              <BreadcrumbItem
                class="hidden md:block"
              >
                <BreadcrumbLink
                  as-child
                >
                  <NuxtLink :to="{ path: pageCrumb?.path || '' }">
                    {{ pageCrumb?.name }}
                  </NuxtLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div
          id="pagination"
          class="p-3"
        />
        <div
          id="page-component"
          class="p-3"
        />
      </header>
      <div class="flex flex-1 flex-row gap-4 w-full pt-0 overflow-hidden">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
