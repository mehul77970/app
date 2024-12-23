import type { UserDto } from '@jellyfin/sdk/lib/generated-client'
import { notify } from 'notiwind'
import { defineStore } from 'pinia'
import { useAuthenticationStore } from './AuthenticationStore'
import { fileToBase64 } from '~/lib/utils'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserDto | null,
  }),
  getters: {
    isAdmin(): boolean {
      return this.user?.Policy?.IsAdministrator === true
    },
  },

  actions: {
    async getUser() {
      const route = useRoute()
      if (route.path === '/login' || route.path === '/setup') return

      const authentication = useAuthenticationStore()

      if (!authentication.loggedIn) {
        notify({ title: 'Invalid Authentication', type: 'danger' })
        await navigateTo('/login')
        return
      }

      try {
        const data = await useApiFetch<UserDto>(
          `Users/${this.user!.Id!}`,
          {
            headers: {
              Authorization: authentication.header,
            },
          },
        )

        this.user = data
        return data
      }
      catch (e: unknown) {
        notify({ title: 'Invalid Authentication', type: 'danger' })
        return e
      }
    },

    getUserImage(size: number = 512) {
      if (!this.user) return

      const server = useServerStore()

      return `${server.url}/UserImage?userId=${this.user.Id!}&maxHeight=${size}`
    },

    async setUserImage(file: File) {
      const authentication = useAuthenticationStore()
      const fileBase64 = await fileToBase64(file)

      await useApiFetch(`Users/${this.user?.Id}/Images/Primary`, {
        method: 'POST',
        headers: {
          'Authorization': authentication.header,
          'Content-Type': file.type,
        },
        body: fileBase64,
      })
    },
  },
  persist: {
    pick: ['user'],
  },
})
