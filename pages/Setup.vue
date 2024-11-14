<script setup lang="ts">
import { PhCircleNotch } from "@phosphor-icons/vue";
import { notify } from "notiwind";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useServerStore } from "@/stores/ServerStore";

const serverStore = useServerStore();

const url = ref("");
const load = ref({
  loading: false,
  error: null as null | string,
});

async function saveUrl() {
  load.value.loading = true;
  try {
    await serverStore.testServerURL(url.value);
    serverStore.setServerURL(url.value);
    navigateTo("/login");
  } catch (e: unknown) {
    load.value.error = (e as Error).message;
    notify(
      {
        title: "Invalid Server",
        type: "error",
        text: load.value.error,
        group: "bottom",
      },
      5000,
    );
    throw e;
  }

  load.value.loading = false;
  // navigateTo('/login')
}
</script>

<template>
  <div
    class="w-full min-h-[100vh] flex flex-col items-center justify-center max-w-full"
  >
    <div class="max-w-[80%] flex flex-col gap-8 justify-center items-center">
      <img
        src="~/assets/images/jellyfin/banner-dark.svg"
        height="256px"
        width="256px"
      />
      <div class="inline-flex flex-col gap-2 text-center">
        <h1 class="text-3xl font-bold">Getting Started</h1>
        <p class="text-balance text-muted-foreground">
          Please enter your server URL to continue
        </p>
      </div>
      <div class="inline-flex flex-col gap-2">
        <div class="inline-flex flex-col gap-2 min-w-[350px]">
          <Label for="url">Server URL</Label>
          <Input
            id="url"
            v-model="url"
            type="text"
            placeholder="http://localhost:8096"
            required
          />
        </div>

        <Button
          type="submit"
          class="w-full"
          :disabled="load.loading"
          @click="saveUrl"
        >
          <template v-if="load.loading">
            <PhCircleNotch :size="18" class="animate-spin w-4 h-4 mr-2" />
          </template>
          Save
        </Button>

        <div class="info inline-flex flex-col gap-2 mt-4">
          <p class="font-semibold">Self Hosting</p>

          <p>SERVER_URL=serverurl (TODO)</p>
        </div>
      </div>
    </div>
  </div>
</template>
