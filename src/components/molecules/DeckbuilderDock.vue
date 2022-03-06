<script lang="ts" setup>
import { computed } from 'vue'

// Store
import { useAuthStore } from '@/stores/useAuthStore'

// Components
import IconButtonLabelled from '@/components/atoms/IconButtonLabelled.vue'

// Icons
import ExportIcon from '@/components/atoms/icons/ExportIcon.vue'
import DecklistsIcon from '@/components/atoms/icons/DecklistsIcon.vue'

const emit = defineEmits<{
  (event: 'view'): void
  (event: 'export'): void
}>()

const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)
</script>

<template>
  <div
    class="fixed bottom-0 flex items-center px-2 pt-1 pb-3 transform -translate-x-1/2 bg-white shadow-lg left-1/2 rounded-t-md dark:bg-gray-900"
  >
    <template v-if="isLoggedIn">
      <slot></slot>
    </template>

    <IconButtonLabelled
      @click="emit('export')"
      size="xl"
      tooltip="Export decklist to .txt"
      label="Export"
    >
      <ExportIcon />
    </IconButtonLabelled>

    <template v-if="isLoggedIn">
      <div class="w-0.5 h-8 mx-2 bg-gray-500" />

      <IconButtonLabelled
        @click="emit('view')"
        size="xl"
        tooltip="View decklists"
        label="Decks"
      >
        <DecklistsIcon />
      </IconButtonLabelled>
    </template>
  </div>
</template>

<style lang="scss"></style>
