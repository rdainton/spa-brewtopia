<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { routeNames } from '@/router'

// Store
import { useAuthStore } from '@/stores/useAuthStore'

// Components
import BrewButton from '@/components/molecules/BrewButton.vue'
import TheLogo from '@/components/TheLogo.vue'
import DecklistMeta from '@/components/organisms/DecklistMeta.vue'

const route = useRoute()

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)
</script>

<template>
  <header
    class="flex items-center justify-end w-full h-16 px-4 py-2 border-b border-blue-dark bg-smoke-dark shrink-0"
  >
    <RouterLink
      :to="{ name: routeNames.deckbuilder }"
      class="relative flex items-center mr-4 -left-1 -top-0.5"
    >
      <TheLogo />
    </RouterLink>

    <DecklistMeta v-if="route.name === routeNames.deckbuilder && isLoggedIn" />

    <div class="flex items-center ml-auto text-white">
      <template v-if="isLoggedIn">
        <RouterLink :to="{ name: routeNames.logout }" class="hover:underline">
          <BrewButton size="xs">Logout</BrewButton>
        </RouterLink>
      </template>

      <template
        v-else-if="
          route.name !== routeNames.login && route.name !== routeNames.register
        "
      >
        <RouterLink :to="{ name: routeNames.login }" class="hover:underline">
          <BrewButton size="xs">Login</BrewButton>
        </RouterLink>
      </template>
    </div>
  </header>
</template>
