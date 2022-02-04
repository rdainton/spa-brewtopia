<script lang="ts" setup>
import { computed } from 'vue'

// Store
import { useStore } from 'vuex'
import { GetterTypes as AuthGetters } from '@/store/auth/getters'

// Components
import TheLogo from '@/components/TheLogo.vue'

const store = useStore()

const isLoggedIn = computed(() => store.getters[AuthGetters.IS_AUTH])
</script>

<template>
  <header
    class="flex items-center w-full h-12 px-4 py-2 bg-white dark:bg-gray-900"
  >
    <RouterLink :to="{ name: 'deckbuilder' }">
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
