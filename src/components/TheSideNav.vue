<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

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
    class="fixed right-0 flex flex-col items-center justify-start w-16 py-2 gap-y-4 top-16 h-sidenav bg-white/50 dark:bg-gray-900/80"
  >
    <IconButtonLabelled
      v-if="route.name === 'deckbuilder'"
      @click="exportToTxtFile"
      size="xl"
      tooltip="Export decklist to .txt"
      label="Export"
    >
      <ExportIcon />
    </IconButtonLabelled>

    <template v-if="isLoggedIn && route.name !== 'decklists'">
      <RouterLink :to="{ name: 'decklists' }">
        <IconButtonLabelled size="xl" tooltip="View decklists" label="Decks">
          <DecklistsIcon />
        </IconButtonLabelled>
      </RouterLink>
    </template>
  </aside>
</template>

<style lang="scss">
.h-sidenav {
  height: calc(100vh - 4rem);
}
</style>
