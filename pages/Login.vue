<script setup lang="ts">
import { notify } from 'notiwind'
import { PhCircleNotch } from '@phosphor-icons/vue'
import { useAuthenticationStore } from '../stores/AuthenticationStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useServerStore } from '@/stores/ServerStore'

const authenticationStore = useAuthenticationStore()
const serverStore = useServerStore()

const config = computed(() => serverStore.config)

const cardSlideshow = ref(0)
const router = useRouter()

const loginCreds = ref({
  username: '',
  password: '',

  invalid: false,
})

const load = ref({
  loading: false,
})

// const nameInput = ref();
// const passwordInput = ref();
// const loginButton = ref();

// const focusMap = {
//   currentItem: 0,
//   items: [
//     {
//       type: 'vertical',
//       currentItem: 0,
//       items: [
//         nameInput,
//         passwordInput,
//         loginButton,
//       ]
//     }
//   ]
// };

onMounted(() => {
  // window.addEventListener('keydown', (key) => {
  //   switch (key.key) {
  //     case "ArrowDown":
  //       determineNextElement(focusMap, 'down')
  //       break;
  //     case "ArrowUp":
  //       determineNextElement(focusMap, 'up')
  //       break;
  //   }
  // });

  setInterval(() => {
    if (cardSlideshow.value == 1) {
      cardSlideshow.value = 0
      return
    }

    cardSlideshow.value += 1
  }, 5000)
})

const login = async () => {
  load.value.loading = true
  try {
    await authenticationStore.loginWithUsernameAndPassword(
      loginCreds.value.username,
      loginCreds.value.password,
    )
    notify(
      {
        title: 'Successful Login',
        type: 'success',
        text: 'Welcome back',
        group: 'bottom',
      },
      5000,
    )

    router.push({ name: 'authenticated' })

    console.log('Pushed route', router.currentRoute.value)
  }
  catch {
    notify(
      {
        title: 'Unable to login',
        type: 'error',
        text: 'Username or password is incorrect',
        group: 'bottom',
      },
      5000,
    )
    loginCreds.value.invalid = true
  }

  load.value.loading = false
}

await serverStore.getServerConfig()
</script>

<template>
  <ClientOnly>
    <div class="w-full min-h-[100vh] lg:grid lg:grid-cols-2">
      <div class="flex items-center justify-center py-12">
        <div class="mx-auto grid w-[350px] gap-6">
          <img
            src="~/assets/images/jellyfin/banner-dark.svg"
            class="lg:mb-[35%] mb-[20%]"
          >
          <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">
              Login
            </h1>
            <p class="text-balance text-muted-foreground">
              Enter your username and password below to login to your account
            </p>
          </div>
          <div
            v-focus-section
            class="grid gap-4"
          >
            <div class="grid gap-2">
              <Label for="name">Name</Label>
              <Input
                id="name"
                ref="nameInput"
                v-model="loginCreds.username"
                v-focus
                type="text"
                placeholder="username"
                required
                autofocus
              />
            </div>

            <div class="grid gap-2">
              <div class="flex items-center">
                <Label for="password">Password</Label>
                <!-- <a href="/forgot-password" class="ml-auto inline-block text-sm underline">
                Forgot your password?
              </a> -->
              </div>
              <Input
                id="password"
                v-model="loginCreds.password"
                v-focus
                type="password"
                required
              />
            </div>
            <Button
              v-focus
              type="submit"
              class="w-full"
              :disabled="load.loading"
              @click="login()"
            >
              <template v-if="load.loading">
                <PhCircleNotch
                  :size="18"
                  class="animate-spin w-4 h-4 mr-2"
                />
              </template>
              Login
            </Button>

            <div class="server-message mt-8 text-center">
              <span>{{ config?.LoginDisclaimer }}</span>
            </div>
          </div>
        </div>
      </div>
      <LazyLoginCarosuel />
    </div>
  </ClientOnly>
</template>

<style>
#test-image-grad {
  mask-image: linear-gradient(
    10deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  object-fit: cover;
}
</style>
