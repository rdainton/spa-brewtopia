<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import config from '@/config'
import { routeNames } from '@/router'

// Composables
import useExport from '@/composables/useExport'

// Store
import { useAuthStore } from '@/stores/useAuthStore'
import { useDecklistStore } from '@/stores/useDecklistStore'
import { useCardStore } from '@/stores/useCardStore'

// Components
import IconButtonLabelled from '@/components/atoms/IconButtonLabelled.vue'

// Icons
import DecklistsIcon from '@/components/atoms/icons/DecklistsIcon.vue'
import ExportIcon from '@/components/atoms/icons/ExportIcon.vue'
import InformationIcon from '@/components/atoms/icons/InformationIcon.vue'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)

const route = useRoute()

/**
 * Export
 */
const cardStore = useCardStore()
const decklistStore = useDecklistStore()
const { decklist, name } = storeToRefs(decklistStore)

const { exportToTxtFile } = useExport(decklist, name, cardStore.cards)
</script>

<template>
  <aside
    class="fixed right-0 flex flex-col items-center justify-start w-16 pt-2 pb-6 gap-y-4 top-16 h-sidenav bg-gray-900/80"
  >
    <IconButtonLabelled
      v-if="route.name === routeNames.deckbuilder"
      @click="exportToTxtFile"
      size="xl"
      tooltip="Export decklist to .txt"
      label="Export"
    >
      <ExportIcon />
    </IconButtonLabelled>

    <template v-if="isLoggedIn && route.name !== routeNames.decklists">
      <RouterLink :to="{ name: routeNames.decklists }">
        <IconButtonLabelled size="xl" tooltip="View decklists" label="Decks">
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
      <IconButtonLabelled
        size="xl"
        tooltip="Support Brewtopia.io"
        label="ko-Fi"
      >
        <img
          src="@/assets/kofi-logo-web.png"
          alt="Ko-Fi Logo"
          class="w-full max-w-full"
        />
      </IconButtonLabelled>
    </a>

    <RouterLink :to="{ name: routeNames.info }">
      <IconButtonLabelled size="xl" tooltip="Info" label="Info">
        <InformationIcon />
      </IconButtonLabelled>
    </RouterLink>
  </aside>
</template>

<style lang="scss">
.h-sidenav {
  height: calc(100vh - 4rem);
}
</style>
