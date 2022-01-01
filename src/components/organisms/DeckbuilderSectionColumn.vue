<script lang="ts" setup>
import { computed } from 'vue'
import useDraggedOver from '../../composables/useDraggedOver'
import PlusIcon from '../atoms/icons/PlusIcon.vue'

interface DeckbuildingSectionColumnProps {
  last: boolean
}

const props = defineProps<DeckbuildingSectionColumnProps>()

const emit = defineEmits<{
  (event: 'drop', e: DragEvent, forceCardIndex: number): void
  (event: 'dragover'): void
}>()

/**
 * Manage draggedOver state, and its impact on styling
 */
const { draggedOver, handleDragenter, handleDragleave, reset } =
  useDraggedOver()

const dragStyles = computed(() => {
  const baseDragStyles = 'border-2'
  return `${baseDragStyles} ${
    draggedOver.value
      ? 'border-red-500 border-dashed'
      : 'border-gray-100 dark:border-gray-800'
  }`
})

// reduced width and includes + icon
const lastColumnStyles = computed(() =>
  props.last ? 'w-16 max-w-16 relative' : 'w-42 min-w-42 max-w-42'
)

/**
 * Handle an ICard drop.
 */
function handleDrop(e: DragEvent, forceCardIndex = -1) {
  reset()
  emit('drop', e, forceCardIndex)
}

function handleDropAtTop(e: DragEvent) {
  // forceCardIndex to 0 - first in list.
  handleDrop(e, 0)
}
</script>

<template>
  <div
    class="flex-1 flex-shrink-0 min-h-full px-1 pb-4 bg-transparent border rounded-md "
    :class="[dragStyles, lastColumnStyles]"
    @dragenter.prevent="handleDragenter"
    @dragleave="handleDragleave"
    @dragover.prevent="emit('dragover')"
    @drop.stop="handleDrop"
  >
    <div v-if="!last" class="w-full h-6" @drop.stop="handleDropAtTop" />
    <slot />
    <PlusIcon v-if="last" />
  </div>
</template>
