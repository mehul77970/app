<script setup lang="ts">
const serverStore = useServerStore()

const info = computed(() => serverStore.info)

await serverStore.testServerURL(serverStore.url)
</script>

<template>
  <div class="grid gap-6">
    <h2 class="text-2xl font-semibold">
      General
    </h2>

    <Card>
      <CardHeader>
        <CardTitle>{{ info?.ProductName }}</CardTitle>
      </CardHeader>
      <CardContent
        class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
      >
        <div class="details inline-flex flex-wrap justify-between w-full gap-4">
          <div class="inline-flex detail flex-col gap-2">
            <span class="font-semibold">Name</span>
            <span class="text-secondary-foreground/50">{{
              info?.ServerName
            }}</span>
          </div>
          <div class="inline-flex detail flex-col gap-2">
            <span>Version</span>
            <span class="text-secondary-foreground/50">{{
              info?.Version
            }}</span>
          </div>

          <div class="inline-flex flex-wrap gap-2 justify-center">
            <SettingsServerScanLibraries />

            <SettingsServerRestart />

            <Button
              variant="destructive"
              class="flex-grow"
            >
              Shutdown
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Active Devices</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent
        class="inline-flex flex-col justify-between gap-3 flex-wrap w-full"
      >
        <div
          class="details inline-flex flex-wrap justify-start w-full gap-4 basis-1/4"
        >
          <span class="text-secondary-foreground/50">Coming Soon</span>
          <!-- <Card class="flex-grow" v-for="(_, index) in [, , , , , ,]" v-bind:key="index">
                        <CardHeader>
                            <CardTitle class="inline-flex gap-3 items-center flex-wrap text-lg">
                                <img height="64" width="64" src="/placeholder.svg" class="rounded-lg">
                                <div class="inline-flex flex-col text-secondary-foreground/50">
                                    <span>Firefox</span>
                                    <span>Jellyfin Web</span>
                                </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div class="bg-secondary max-w-full w-full aspect-video rounded-lg"></div>
                        </CardContent>
                    </Card> -->
        </div>
      </CardContent>
    </Card>
  </div>
</template>
