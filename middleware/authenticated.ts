import type { UserDto } from '@jellyfin/sdk/lib/generated-client'

export default defineNuxtRouteMiddleware(async () => {
  const serverStore = useServerStore()
  const server = useCookie('server')

  if (window?.wails) {
    await useNativeStorage()
  }

  if (!server.value && !serverStore.url) return setup()

  const authentication = useCookie('authentication')
  const user = useCookie('user')
  const authStore = useAuthenticationStore()
  const userStore = useUserStore()

  const auth = authentication.value as unknown as {
    _header: {
      client: string
      device: string
      deviceID: string
      version: string
      authorization: string
    }
    loggedIn: boolean
  }

  if (!auth) return login()

  authStore._header = auth._header
  authStore.loggedIn = auth.loggedIn

  const userVal = user.value as unknown as { user: UserDto }
  if (!userVal) return

  userStore.user = userVal.user

  console.log(`You're authenticated! Welcome back ${userStore.user.Name} :)`)
})

const login = () => {
  return '/login'
}

const setup = () => {
  return '/setup'
}
