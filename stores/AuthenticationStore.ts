import type { AuthenticationResult } from '@jellyfin/sdk/lib/generated-client'
import { defineStore } from 'pinia'
import { useUserStore } from './UserStore'
import { getBrowser } from '~/lib/utils'

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    _header: {
      client: 'Shaddy',
      device: '?',
      deviceID: '?',
      version: '0.0.1-DEV',
      authorization: null as null | string,
    },

    loggedIn: false,
  }),

  getters: {
    header(): string {
      let headerString = `MediaBrowser Client="${this._header.client}", Device="${this._header.device}", DeviceId="${this._header.deviceID}", Version="${this._header.version}"`

      if (this._header.authorization) {
        headerString += `, Token="${this._header.authorization}"`
      }

      return headerString
    },
  },

  actions: {
    async loginWithUsernameAndPassword(Username: string, Pw: string) {
      const userStore = useUserStore()

      const deviceUUID = uuidv4()
      const browser = getBrowser()

      const data = await useApiFetch<AuthenticationResult>(
        `Users/AuthenticateByName`,
        {
          method: 'POST',
          headers: {
            Authorization: `MediaBrowser Client="Shadfin", Device="${browser}", DeviceId="${deviceUUID}", Version="${this._header.version}"`,
          },
          body: {
            Username,
            Pw,
          },
        },
      )

      userStore.user = data!.User!
      this._header.authorization = data!.AccessToken!
      this._header.device = browser
      this._header.deviceID = deviceUUID
      this.loggedIn = true
    },
  },

  persist: {
    pick: ['_header', 'loggedIn'],
  },
})

function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16),
  )
}
