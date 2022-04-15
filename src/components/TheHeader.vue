<script lang="ts" setup>
import { computed } from 'vue'

// Store
import { useAuthStore } from '@/stores/useAuthStore'

// Components
import TheLogo from '@/components/TheLogo.vue'

const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)
</script>

<template>
  <header
    class="flex items-center w-full h-12 px-4 py-2 bg-white dark:bg-gray-900"
  >
    <RouterLink
      :to="{ name: 'deckbuilder' }"
      class="fixed z-10 flex items-center left-1 -top-4"
    >
      <TheLogo />
    </RouterLink>

    <div class="flex items-center ml-auto dark:text-white">
      <template v-if="isLoggedIn">
        <RouterLink :to="{ name: 'logout' }" class="hover:underline">
          Logout
        </RouterLink>
      </template>

      <template v-else>
        <RouterLink :to="{ name: 'login' }" class="hover:underline">
          Login
        </RouterLink>
        <span class="mx-2">|</span>
        <RouterLink :to="{ name: 'register' }" class="hover:underline">
          Register
        </RouterLink>
      </template>
    </div>
  </header>
</template>
