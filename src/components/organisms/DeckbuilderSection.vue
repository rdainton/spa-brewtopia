<script lang="ts" setup>
import { ref, computed } from 'vue'
import useDrag from '../../composables/useDrag'
import { ICard } from '../../types/cards'

// Components
import Title from '../atoms/SectionTitle.vue'
import Column from './DeckbuilderSectionColumn.vue'
import Card from '../molecules/Card.vue'

interface DeckbuildingSectionProps {
  title: string
  sectionData: ICard[][]
  alignment?: 'left' | 'center' | 'right'
}

withDefaults(defineProps<DeckbuildingSectionProps>(), {
  alignment: 'center',
})

const emit = defineEmits<{
  (event: 'drop', e: DragEvent, columnIndex: number): void
  (event: 'dragstart', card: ICard, columnIndex: number): void
  (event: 'dragover', columnIndex: number): void
  (event: 'duplicate', card: ICard, columnIndex: number): void
  (event: 'playset', card: ICard, columnIndex: number): void
  (event: 'delete', card: ICard, columnIndex: number): void
}>()

type ActionType = 'duplicate' | 'playset' | 'delete' | 'dragstart'

// Card Management
function handleAction(action: ActionType, card: ICard, columnIndex: number) {
  emit(action, card, columnIndex)
}

// Dragging
const { draggedOver, handleDragenter, handleDragleave, reset } = useDrag()

// when a child is a drop zone and is being dragged over,
// mute the styles of this component
const dragMuted = ref(false)

const dragStyles = computed(() => {
  const baseDragStyles = 'border-4 border-dashed'
  return `${baseDragStyles} ${
    draggedOver.value && !dragMuted.value
      ? 'border-red-500'
      : 'border-transparent'
  }`
})

function handleSectionDragover() {
  if (!dragMuted.value) emit('dragover', 0) // default first column
}

function handleColumnDragover(columnIndex: number) {
  emit('dragover', columnIndex)
}

// Styles
const baseStyles = 'px-4 py-6 flex flex-col'

const alignmentmentStylesMap: Record<string, string> = {
  left: 'mr-auto ml-0',
  center: '',
  right: 'ml-auto mr-0',
}

function handleDrop(e: DragEvent, columnIndex = 0) {
  reset() // reset draggedOver
  emit('drop', e, columnIndex)
}
</script>

<template>
  <div
    :class="[baseStyles, alignmentmentStylesMap[alignment!], dragStyles]"
    @dragenter.prevent="handleDragenter"
    @dragleave="handleDragleave"
    @dragover.prevent="handleSectionDragover"
    @drop="handleDrop"
  >
    <Title>
      {{ title }}
    </Title>

    <div class="flex flex-1 w-full bg-transparent gap-x-2">
      <Column
        v-for="(column, columnIndex) in sectionData"
        :last="columnIndex + 1 === sectionData.length"
        @drag-focus="focus => (dragMuted = focus)"
        @dragover="handleColumnDragover(columnIndex)"
        @drop="e => handleDrop(e, columnIndex)"
      >
        <Card
          v-for="(card, idx) in column"
          :id="card.id"
          :key="card.uuid"
          :data="card"
          :stacked="idx !== 0"
          with-controls
          @dragstart="handleAction('dragstart', card, columnIndex)"
          @duplicate="handleAction('duplicate', card, columnIndex)"
          @playset="handleAction('playset', card, columnIndex)"
          @delete="handleAction('delete', card, columnIndex)"
        />
      </Column>
    </div>
  </div>
</template>
