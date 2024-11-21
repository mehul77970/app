<script setup lang="ts">
const deviceStore = useDeviceStore()

const nativeEnviroment = computed(() => deviceStore.nativeEnviroment)
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <main
      class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10"
    >
      <div class="mx-auto grid w-full max-w-6xl gap-2">
        <h1 class="text-3xl font-semibold">
          Settings
        </h1>
      </div>
      <div
        class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
      >
        <nav class="grid gap-4 text-sm text-muted-foreground">
          <SettingsLink :to="{ name: 'authenticated-settings' }">
            General
          </SettingsLink>

          <SettingsLink :to="{ name: 'authenticated-settings-browse' }">
            Browse
          </SettingsLink>

          <SettingsLink :to="{ name: 'authenticated-settings-player' }">
            Player
          </SettingsLink>
          <SettingsLink
            v-if="nativeEnviroment"
            :to="{ name: 'authenticated-settings-desktop' }"
          >
            Desktop
          </SettingsLink>
          <SettingsLink :to="{ name: 'authenticated-settings-theme' }">
            Theme
          </SettingsLink>
          <SettingsLink :to="{ name: 'authenticated-settings-about' }">
            About
          </SettingsLink>
        </nav>

        <NuxtPage />
      </div>
    </main>
  </div>
</template>
