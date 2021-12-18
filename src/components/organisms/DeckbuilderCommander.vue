<script lang="ts" setup>
import { computed } from 'vue'
import useDrag from '../../composables/useDrag'

// Components
import Title from '../atoms/SectionTitle.vue'
import CommanderIcon from '../atoms/icons/CommanderIcon.vue'

const baseStyles = 'px-4 py-6 flex flex-col'

// Dragging
const { draggedOver, handleDragenter, handleDragleave } = useDrag()

const dragStyles = computed(() => {
  const baseDragStyles = 'border-2'
  return `${baseDragStyles} ${
    draggedOver.value
      ? 'border-red-500 border-dashed'
      : 'border-gray-100 dark:border-gray-900'
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
        class="flex items-center justify-center w-48 h-64 p-4 bg-white rounded-md  dark:bg-gray-800"
        :class="dragStyles"
        @dragenter.prevent="handleDragenter"
        @dragleave="handleDragleave"
        @dragover="handleDragover"
      >
        <div class="w-32 h-32 dark:text-gray-900">
          <CommanderIcon />
        </div>
      </div>
    </div>
  </div>
</template>
