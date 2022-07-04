<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import config from '@/config'
import { routeNames } from '@/router'

// Store
import { useAuthStore } from '@/stores/useAuthStore'
import { useDecklistStore } from '@/stores/useDecklistStore'

// Components
import IconButtonLabelled from '@/components/atoms/IconButtonLabelled.vue'
import DecklistExport from '@/components/organisms/DecklistExport.vue'

// Icons
import DecklistsIcon from '@/components/atoms/icons/DecklistsIcon.vue'
import ExportIcon from '@/components/atoms/icons/ExportIcon.vue'
import InformationIcon from '@/components/atoms/icons/InformationIcon.vue'
import DeckbuilderIcon from '@/components/atoms/icons/DeckbuilderIcon.vue'
import ChatIcon from '@/components/atoms/icons/ChatIcon.vue'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)

const route = useRoute()

const decklistStore = useDecklistStore()
</script>

<template>
  <aside
    class="fixed right-0 flex flex-col items-center justify-start w-16 pt-2 pb-6 gap-y-4 top-16 h-[calc(100vh-4rem)] bg-smoke-dark border-l border-blue-dark"
  >
    <template v-if="route.name !== routeNames.deckbuilder">
      <RouterLink :to="{ name: routeNames.deckbuilder }">
        <IconButtonLabelled size="xl" label="Builder">
          <DeckbuilderIcon />
        </IconButtonLabelled>
      </RouterLink>
    </template>

    <DecklistExport v-if="route.name === routeNames.deckbuilder">
      <template #control="{ handler }">
        <IconButtonLabelled
          @click="handler"
          size="xl"
          label="Export"
          :disabled="!decklistStore.uniqueCardIds.length"
        >
          <ExportIcon />
        </IconButtonLabelled>
      </template>
    </DecklistExport>

    <template v-if="isLoggedIn && route.name !== routeNames.decklists">
      <RouterLink :to="{ name: routeNames.decklists }">
        <IconButtonLabelled size="xl" label="Decks">
          <DecklistsIcon />
        </IconButtonLabelled>
      </RouterLink>
    </template>

    <a
      :href="config.donationsUrl"
      target="_blank"
      rel="noopener nofollow"
      class="mt-auto"
    >
      <IconButtonLabelled size="xl" label="ko-Fi">
        <img
          src="@/assets/kofi-logo-web.png"
          alt="Ko-Fi Logo"
          class="w-full max-w-full"
        />
      </IconButtonLabelled>
    </a>

    <RouterLink :to="{ name: routeNames.feedback }">
      <IconButtonLabelled size="xl" label="Feedback">
        <ChatIcon />
      </IconButtonLabelled>
    </RouterLink>

    <RouterLink :to="{ name: routeNames.info }">
      <IconButtonLabelled size="xl" label="Info">
        <InformationIcon />
      </IconButtonLabelled>
    </RouterLink>
  </aside>
</template>
