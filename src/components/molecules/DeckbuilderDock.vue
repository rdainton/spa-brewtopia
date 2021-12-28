<script lang="ts" setup>
import IconButton from '../atoms/IconButton.vue'
import ExportIcon from '../atoms/icons/ExportIcon.vue'

const emit = defineEmits<{
  (event: 'export'): void
}>()
</script>

<template>
  <div
    class="fixed bottom-0 p-2 transform -translate-x-1/2 bg-white shadow-xl  left-1/2 rounded-t-md dark:bg-gray-900"
  >
    <IconButton @click="emit('export')" size="xl">
      <ExportIcon />
    </IconButton>
  </div>
</template>

<style lang="scss"></style>
