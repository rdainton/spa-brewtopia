<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Store
import { useAuthStore } from '@/stores/useAuthStore'

// Components
import TheLogo from '@/components/TheLogo.vue'
import DecklistMeta from '@/components/organisms/DecklistMeta.vue'

const route = useRoute()

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)
</script>

<template>
  <header
    class="flex items-center justify-end w-full h-16 px-4 py-2 bg-white border-b-2 border-gray-100 shrink-0 dark:border-gray-800 dark:bg-gray-900"
  >
    <RouterLink
      :to="{ name: 'deckbuilder' }"
      class="relative flex items-center mr-4 -left-1 -top-0.5"
    >
      <TheLogo />
    </RouterLink>

    <DecklistMeta v-if="route.name === 'deckbuilder' && isLoggedIn" />

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
      </template>
    </div>
  </header>
</template>
