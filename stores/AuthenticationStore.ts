import { defineStore } from "pinia";
import type { AuthenticationResult } from "@jellyfin/sdk/lib/generated-client";
import { useUserStore } from "./UserStore";
import { getBrowser } from "~/lib/utils";

export const useAuthenticationStore = defineStore("authentication", {
  state: () => ({
    _header: {
      client: "Shaddy",
      device: "?",
      deviceID: "?",
      version: "0.0.1-DEV",
      authorization: null as null | string,
    },

    loggedIn: false,
  }),

  getters: {
    header(): string {
      let headerString = `MediaBrowser Client="${this._header.client}", Device="${this._header.device}", DeviceId="${this._header.deviceID}", Version="${this._header.version}"`;

      if (this._header.authorization) {
        headerString += `, Token="${this._header.authorization}"`;
      }

      return headerString;
    },
  },

  actions: {
    async loginWithUsernameAndPassword(Username: string, Pw: string) {
      const userStore = useUserStore();

      const deviceUUID = crypto.randomUUID();
      const browser = getBrowser();

      const data = await useApiFetch<AuthenticationResult>(
        `Users/AuthenticateByName`,
        {
          method: "POST",
          headers: {
            Authorization: `MediaBrowser Client="Shaddy", Device="${browser}", DeviceId="${deviceUUID}", Version="${this._header.version}"`,
          },
          body: {
            Username,
            Pw,
          },
        },
      );

      userStore.user = data!.User!;
      this._header.authorization = data!.AccessToken!;
      this._header.device = browser;
      this._header.deviceID = deviceUUID;
      this.loggedIn = true;
    },
  },

  persist: {
    pick: ["_header", "loggedIn"],
  },
});
