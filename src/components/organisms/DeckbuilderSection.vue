<script lang="ts" setup>
import { computed } from 'vue'
import { ICard } from '@/types/cards'

// Stores
import { useCardStore } from '@/stores/useCardStore'

// Components
import Title from '@/components/atoms/SectionTitle.vue'
import Column from './DeckbuilderSectionColumn.vue'
import Card from '@/components/molecules/Card.vue'
import BrewText from '@/components/atoms/BrewText.vue'

interface DeckbuildingSectionProps {
  title: string
  sectionData: ICard[][]
  alignment?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<DeckbuildingSectionProps>(), {
  alignment: 'center',
})

const emit = defineEmits<{
  (event: 'drop', e: DragEvent, columnIndex: number, forceCardIdx: number): void
  (event: 'dragstart', card: ICard, columnIndex: number): void
  (event: 'dragover', columnIndex: number): void
  (event: 'duplicate', card: ICard, columnIndex: number): void
  (event: 'playset', card: ICard, columnIndex: number): void
  (event: 'delete', card: ICard, columnIndex: number): void
  (event: 'change-art', card: ICard): void
}>()

const cardStore = useCardStore()

// Count
const cardsInSection = computed(() => {
  return props.sectionData.reduce((count, list) => {
    return count + list.length
  }, 0)
})

const titleOutput = computed(() => `${props.title} (${cardsInSection.value})`)

function handleColumnDragover(columnIndex: number) {
  emit('dragover', columnIndex)
}

// Styles
const baseStyles = 'px-4 pt-4 flex flex-col'

const alignmentmentStylesMap: Record<string, string> = {
  left: 'mr-auto ml-0 pr-20',
  center: '',
  right: 'ml-auto mr-0',
}

function handleDrop(e: DragEvent, columnIndex = 0, forceCardIdx = -1) {
  emit('drop', e, columnIndex, forceCardIdx)
}
</script>

<template>
  <section :class="[baseStyles, alignmentmentStylesMap[alignment!]]">
    <div class="mb-2">
      <Title class="mb-1">
        {{ titleOutput }}
      </Title>

      <slot />
    </div>

    <div class="flex flex-col flex-1 overflow-x-auto">
      <header class="flex w-full h-6 bg-transparent gap-x-1">
        <div
          v-for="(column, columnIndex) in sectionData"
          :class="[columnIndex + 1 === sectionData.length ? 'w-12' : 'w-42']"
        >
          <BrewText
            v-if="columnIndex + 1 < sectionData.length"
            extend-classes="mb-2 text-sm"
          >
            ({{ column.length }})
          </BrewText>
        </div>
      </header>

      <div class="flex flex-1 w-full overflow-y-auto bg-transparent gap-x-1">
        <Column
          v-for="(column, columnIndex) in sectionData"
          :last="columnIndex + 1 === sectionData.length"
          @dragover="handleColumnDragover(columnIndex)"
          @drop.prevent="
            (e, forceCardIdx) => handleDrop(e, columnIndex, forceCardIdx)
          "
        >
          <Card
            v-for="(card, idx) in column"
            :id="card.scryId"
            :key="card.uuid"
            :data="cardStore.cards[card.scryId]"
            :i-card="card"
            :stacked="idx !== 0"
            :with-controls="true"
            @dragstart="emit('dragstart', card, columnIndex)"
            @duplicate="emit('duplicate', card, columnIndex)"
            @playset="emit('playset', card, columnIndex)"
            @delete="emit('delete', card, columnIndex)"
            @change-art="emit('change-art', card)"
          />
        </Column>
      </div>
    </div>
  </section>
</template>
