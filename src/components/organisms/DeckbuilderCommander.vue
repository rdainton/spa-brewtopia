<script lang="ts" setup>
import { computed } from 'vue'
import useDraggedOver from '../../composables/useDraggedOver'

// Components
import Title from '../atoms/SectionTitle.vue'
import CommanderIcon from '../atoms/icons/CommanderIcon.vue'

const baseStyles = 'px-4 py-6 flex flex-col'

/**
 * Manage draggedOver state, and its impact on styling
 */
const { draggedOver, handleDragenter, handleDragleave } = useDraggedOver()

const dragStyles = computed(() => {
  const baseDragStyles = 'border-2'
  return `${baseDragStyles} ${
    draggedOver.value ? 'border-red-500 border-dashed' : 'border-gray-900'
  }`
})

function handleDragover() {
  console.log('Commander')
}
</script>

<template>
  <div :class="[baseStyles]">
    <Title>Commander</Title>

    <div class="flex-1 w-full py-4 bg-transparent">
      <div
        class="flex items-center justify-center w-48 h-64 p-4 bg-gray-800 rounded-md"
        :class="dragStyles"
        @dragenter.prevent="handleDragenter"
        @dragleave="handleDragleave"
        @dragover="handleDragover"
      >
        <div class="w-32 h-32 text-gray-900">
          <CommanderIcon />
        </div>
      </div>
    </div>
  </div>
</template>
