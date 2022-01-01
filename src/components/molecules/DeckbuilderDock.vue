<script lang="ts" setup>
// Components
import IconButton from '../atoms/IconButton.vue'

// Icons
import ExportIcon from '../atoms/icons/ExportIcon.vue'
import ClearIcon from '../atoms/icons/ClearIcon.vue'

const emit = defineEmits<{
  (event: 'export'): void
  (event: 'reset'): void
}>()
</script>

<template>
  <div
    class="fixed bottom-0 flex items-center p-2 transform -translate-x-1/2 bg-white shadow-xl  left-1/2 rounded-t-md dark:bg-gray-900"
  >
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
