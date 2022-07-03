<script setup lang="ts">
import { computed } from 'vue'

// Store
import { useAuthStore } from '@/stores/useAuthStore'

// Components
import TheHeader from '@/components/TheHeader.vue'
import TheSideNav from '@/components/TheSideNav.vue'
import TheToastNotifications from '@/components/TheToastNotifications.vue'

const authStore = useAuthStore()

const attemptedAutoLogin = computed(() => authStore.autoAttempted)
</script>

<template>
  <div
    v-if="attemptedAutoLogin"
    class="relative flex-col hidden max-h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] mt-16 mr-16 bg-smoke-dark bg-gradient-to-b from-smoke-dark to-purple-dark lg:flex min-w-screen"
  >
    <TheHeader />
    <RouterView />
    <TheSideNav />
  </div>

  <div
    class="flex items-center justify-center w-screen min-h-screen bg-smoke-dark bg-gradient-to-b from-smoke-dark to-purple-dark lg:hidden"
  >
    <h1 class="text-2xl text-center text-blue-light">
      Hey, please try a viewing this on a larger screen.
    </h1>
  </div>

  <TheToastNotifications />
</template>
