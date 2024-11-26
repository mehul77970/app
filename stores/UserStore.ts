import type { UserDto } from '@jellyfin/sdk/lib/generated-client'
import { notify } from 'notiwind'
import { defineStore } from 'pinia'
import { useAuthenticationStore } from './AuthenticationStore'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserDto | null,
  }),

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

      const server = useServerStore()

      try {
        const data = await useApiFetch<UserDto>(
          `${server.url}/Users/${this.user!.Id!}`,
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
  },
  persist: {
    pick: ['user'],
  },
})
