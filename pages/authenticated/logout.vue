<script setup lang="ts">
const userStore = useUserStore()
const authStore = useAuthenticationStore()
const router = useRouter()

userStore.$reset()
authStore.$reset()

router.push('/login')
</script>

<template>
  <div>
    Logging you out...
  </div>
</template>
