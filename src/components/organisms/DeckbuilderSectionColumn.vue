<script lang="ts" setup>
import { computed } from 'vue'
import useDrag from '../../composables/useDrag'
import PlusIcon from '../atoms/icons/PlusIcon.vue'

interface DeckbuildingSectionColumnProps {
  last: boolean
}

const props = defineProps<DeckbuildingSectionColumnProps>()

const emit = defineEmits<{
  (event: 'drop', e: DragEvent): void
  (event: 'dragover'): void
  (event: 'drag-focus', focus: boolean): void
}>()

// Dragging
const { draggedOver, handleDragenter, handleDragleave, reset } = useDrag(
  () => emit('drag-focus', true),
  () => emit('drag-focus', false)
)

const dragStyles = computed(() => {
  const baseDragStyles = 'border-2'
  return `${baseDragStyles} ${
    draggedOver.value
      ? 'border-red-500 border-dashed'
      : 'border-gray-100 dark:border-gray-800'
  }`
})

//
const lastColumnStyles = computed(() =>
  props.last ? 'w-16 max-w-16 relative' : 'w-44 min-w-44'
)

function handleDrop(e: DragEvent) {
  reset()
  emit('drop', e)
}
</script>

<template>
  <div
    class="flex-1 flex-shrink-0 h-full px-2 py-4 bg-transparent border rounded-md "
    :class="[dragStyles, lastColumnStyles]"
    @dragenter.prevent="handleDragenter"
    @dragleave="handleDragleave"
    @dragover.prevent="emit('dragover')"
    @drop.stop="handleDrop"
  >
    <slot />
    <PlusIcon v-if="last" />
  </div>
</template>
