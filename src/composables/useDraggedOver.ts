import { ref, readonly } from 'vue'

/**
 * Manage draggedOver state - keeping internal track of whether
 * draggable has left.
 *
 * @param enterCallback - optional hook called on dragenter
 * @param leaveCallback - optional hook called on dragleave
 */
export default function useDraggedOver(
  enterCallback?: () => void,
  leaveCallback?: () => void
) {
  const draggedOver = ref(false)
  const _dragCount = ref(0)

  const handleDragenter = () => {
    if (typeof enterCallback === 'function') enterCallback()
    draggedOver.value = true
    _dragCount.value++
  }

  const handleDragleave = () => {
    _dragCount.value--
    if (_dragCount.value <= 0) {
      draggedOver.value = false
      if (typeof leaveCallback === 'function') leaveCallback()
    }
  }

  const reset = () => {
    _dragCount.value = 0
    draggedOver.value = false
  }

  return {
    handleDragenter,
    handleDragleave,
    reset,
    draggedOver: readonly(draggedOver),
  }
}
