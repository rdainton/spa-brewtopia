<script lang="ts" setup>
import { computed } from 'vue'
import useDraggedOver from '../../composables/useDraggedOver'
import PlusIcon from '../atoms/icons/PlusIcon.vue'

interface DeckbuildingSectionColumnProps {
  last: boolean
  empty: boolean
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
  const baseDragStyles = 'border'
  return `${baseDragStyles} ${
    draggedOver.value ? 'border-blue-light' : 'border-smoke-medium'
  }`
})

// reduced width and includes + icon
const lastColumnStyles = computed(() =>
  props.last ? 'w-16 max-w-16 flex' : 'w-42 min-w-42 max-w-42'
)

/**
 * Handle an CardProxy drop.
 */
function handleDrop(e: DragEvent, forceCardIndex = -1) {
  reset()
  emit('drop', e, forceCardIndex)
}

/**
 * Position 0
 */
const {
  draggedOver: draggedOverTop,
  handleDragenter: handleDragenterTop,
  handleDragleave: handleDragleaveTop,
  reset: resetTop,
} = useDraggedOver()

const dragStylesTop = computed(() =>
  draggedOverTop.value
    ? 'rounded-t-lg translate-y-0 bg-blue-light/50'
    : 'translate-y-2'
)

function handleDropAtTop(e: DragEvent) {
  resetTop()
  // forceCardIndex to 0 - first in list.
  handleDrop(e, 0)
}
</script>

<template>
  <div
    class="flex-1 min-h-full p-1 pb-4 bg-transparent border rounded-md shrink-0 h-fit-content"
    :class="[dragStyles, lastColumnStyles]"
    @dragenter.prevent="handleDragenter"
    @dragleave="handleDragleave"
    @dragover.prevent="emit('dragover')"
    @drop.stop="handleDrop"
  >
    <div
      v-if="!last && !empty"
      class="w-full h-6 transition-transform ease-out transform"
      :class="dragStylesTop"
      @dragenter.prevent="handleDragenterTop"
      @dragleave="handleDragleaveTop"
      @drop.stop="handleDropAtTop"
    />

    <slot />

    <div v-if="last" class="w-8 mx-auto text-smoke-light">
      <PlusIcon />
    </div>
  </div>
</template>
