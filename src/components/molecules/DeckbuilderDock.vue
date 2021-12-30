<script lang="ts" setup>
// Components
import IconButton from '../atoms/IconButton.vue'

// Icons
import ExportIcon from '../atoms/icons/ExportIcon.vue'
import SortAscendingIcon from '../atoms/icons/SortAscendingIcon.vue'
import SortDescendingIcon from '../atoms/icons/SortDescendingIcon.vue'
import ClearIcon from '../atoms/icons/ClearIcon.vue'

const emit = defineEmits<{
  (event: 'export'): void
  (event: 'sort-ascending'): void
  (event: 'sort-descending'): void
  (event: 'clear'): void
}>()
</script>

<template>
  <div
    class="fixed bottom-0 flex items-center p-2 transform -translate-x-1/2 bg-white shadow-xl  left-1/2 rounded-t-md dark:bg-gray-900"
  >
    <IconButton
      @click="emit('sort-ascending')"
      size="xl"
      tooltip="Sort by ascending Mana Value"
    >
      <SortAscendingIcon />
    </IconButton>

    <IconButton
      @click="emit('sort-descending')"
      size="xl"
      tooltip="Sort by descending Mana Value"
    >
      <SortDescendingIcon />
    </IconButton>

    <div class="w-0.5 h-8 mx-1 bg-gray-500" />

    <IconButton
      @click="emit('export')"
      size="xl"
      tooltip="Export decklist to .txt"
    >
      <ExportIcon />
    </IconButton>

    <div class="w-0.5 h-8 mx-1 bg-gray-500" />

    <IconButton
      @click="emit('clear')"
      size="xl"
      tooltip="Clear the deckbuilder"
    >
      <ClearIcon />
    </IconButton>
  </div>
</template>

<style lang="scss"></style>
