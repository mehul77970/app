import { defineStore } from "pinia";
import type {
  BrandingOptions,
  PublicSystemInfo,
} from "@jellyfin/sdk/lib/generated-client";

export enum ScheduledTasks {
  GLOBAL_SCAN = "7738148ffcd07979c7ceb148e06b3aed",
}

export const useServerStore = defineStore("server", {
  state: () => ({
    _url: null as null | string,

    info: null as null | PublicSystemInfo,
    config: null as null | BrandingOptions,
  }),

  getters: {
    url(): string {
      const config = useRuntimeConfig();

      if (import.meta.server && config.internalServerUrl)
        return config.internalServerUrl;

      if (config.public.serverUrl) return config.public.serverUrl;

      return this._url!;
    },
  },
  actions: {
    async testServerURL(url: string) {
      const { data, error } = await useFetch<PublicSystemInfo>(
        `${url}/System/Info/Public`,
        { timeout: 5000 },
      );

      if (error.value) {
        throw Error(error.value.message);
      }

      const info = data.value!;

      if (!info.Id) {
        throw Error("Unexpected Response");
      }

      this.info = info;
    },

    async getServerConfig() {
      if (!this.url) return;
      const { data, error } = await useFetch<BrandingOptions>(
        `${this.url}/Branding/Configuration`,
      );

      if (error.value) {
        throw Error(error.value.message);
      }

      this.config = data.value!;
    },

    async scanAllLibraries() {
      const auth = useAuthenticationStore();

      await useApiFetch(
        `ScheduledTasks/Running/${ScheduledTasks.GLOBAL_SCAN}`,
        {
          method: "POST",
          headers: {
            Authorization: auth.header,
          },
        },
      );
    },

    async restartServer() {
      const auth = useAuthenticationStore();

      await useApiFetch(`System/Restart`, {
        method: "POST",
        headers: {
          Authorization: auth.header,
        },
      });
    },

    setServerURL(url: string) {
      this._url = url;
    },
  },

  persist: {
    pick: ["_url", "info", "config"],
  },
});
