<script lang="ts" setup>
import { computed } from 'vue'

// Store
import { useAuthStore } from '@/stores/useAuthStore'

// Components
import IconButton from '../atoms/IconButton.vue'

// Icons
import ExportIcon from '../atoms/icons/ExportIcon.vue'
import LoadIcon from '../atoms/icons/LoadIcon.vue'
import SaveIcon from '../atoms/icons/SaveIcon.vue'

const emit = defineEmits<{
  (event: 'save'): void
  (event: 'view'): void
  (event: 'export'): void
}>()

const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)
</script>

<template>
  <div
    class="fixed bottom-0 flex items-center p-2 transform -translate-x-1/2 bg-white shadow-xl left-1/2 rounded-t-md dark:bg-gray-900"
  >
    <template v-if="isLoggedIn">
      <IconButton
        @click="emit('save')"
        size="xl"
        tooltip="Save current decklist"
      >
        <SaveIcon />
      </IconButton>

      <IconButton
        @click="emit('view')"
        size="xl"
        tooltip="View saved decklists"
      >
        <LoadIcon />
      </IconButton>

      <div class="w-0.5 h-8 mx-1 bg-gray-500" />
    </template>

    <IconButton
      @click="emit('export')"
      size="xl"
      tooltip="Export decklist to .txt"
    >
      <ExportIcon />
    </IconButton>
  </div>
</template>

<style lang="scss"></style>
