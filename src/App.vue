<script setup lang="ts">
import { computed } from 'vue'

// Store
import { useStore } from 'vuex'
import { GetterTypes as AuthGetters } from '@/store/auth/getters'

// Components
import TheHeader from '@/components/TheHeader.vue'
import TheToastNotifications from '@/components/TheToastNotifications.vue'

const store = useStore()

const attemptedAutoLogin = computed(
  () => store.getters[AuthGetters.AUTO_ATTEMPTED]
)
</script>

<template>
  <div
    v-if="attemptedAutoLogin"
    class="relative flex-col hidden max-h-screen min-h-screen lg:flex min-w-screen dark:bg-gray-900"
  >
    <TheHeader />

    <RouterView />
  </div>

  <div
    class="flex items-center justify-center w-screen min-h-screen lg:hidden dark:bg-gray-900"
  >
    <h1
      class="text-2xl text-center text-primary-medium dark:text-dark__primary-light"
    >
      Hey, please try a viewing this on a larger screen.
    </h1>
  </div>

  <TheToastNotifications />
</template>
