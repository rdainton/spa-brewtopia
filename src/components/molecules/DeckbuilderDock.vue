<script lang="ts" setup>
import { computed } from 'vue'

// Store
import { useStore } from 'vuex'
import { GetterTypes as AuthGetters } from '@/store/auth/getters'

// Components
import IconButton from '../atoms/IconButton.vue'

// Icons
import ExportIcon from '../atoms/icons/ExportIcon.vue'
import LoadIcon from '../atoms/icons/LoadIcon.vue'
import SaveIcon from '../atoms/icons/SaveIcon.vue'
import ClearIcon from '../atoms/icons/ClearIcon.vue'

const emit = defineEmits<{
  (event: 'save'): void
  (event: 'load'): void
  (event: 'export'): void
  (event: 'reset'): void
}>()

const store = useStore()

const isLoggedIn = computed(() => store.getters[AuthGetters.IS_AUTH])
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
        @click="emit('load')"
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

    <div class="w-0.5 h-8 mx-1 bg-gray-500" />

    <IconButton
      @click="emit('reset')"
      size="xl"
      tooltip="Reset the deckbuilder"
    >
      <ClearIcon />
    </IconButton>
  </div>
</template>

<style lang="scss"></style>
