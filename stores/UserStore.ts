import { defineStore } from 'pinia'
import type { UserDto } from '@jellyfin/sdk/lib/generated-client'
import { notify } from 'notiwind'
import { useAuthenticationStore } from './AuthenticationStore'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserDto | null,
  }),

  actions: {
    async getUser() {
      const route = useRoute()
      if (route.path == '/login' || route.path == '/setup') return

      const authentication = useAuthenticationStore()

      if (!authentication.loggedIn) {
        notify({ title: 'Invalid Authentication', type: 'danger' })
        await navigateTo('/login')
        return
      }

      const server = useServerStore()

      const { data, error } = useFetch<UserDto>(
        `${server.url}/Users/${this.user!.Id!}`,
        {
          headers: {
            Authorization: authentication.header,
          },
        },
      )

      if (error.value) {
        notify({ title: 'Invalid Authentication', type: 'danger' })
        return error.value
      }

      const user = data.value!
      this.user = user

      return user
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
