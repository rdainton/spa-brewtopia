<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { v4 as uuid } from 'uuid'
import { ICard } from '../../types/cards'

// Components
import CardSearch from '../organisms/CardSearch.vue'
import DeckbuilderMain from '../organisms/DeckbuilderMain.vue'
import DeckbuilderSide from '../organisms/DeckbuilderSide.vue'
import DeckbuilderSection from '../organisms/DeckbuilderSection.vue'
// import DeckbuilderCommander from '../organisms/DeckbuilderCommander.vue'

const mainboard = reactive<ICard[][]>([[], [], []])
const maybes = reactive<ICard[][]>([[], []])
const sideboard = reactive<ICard[][]>([[], []])

interface CardAddress {
  section: ICard[][] | null
  columnIndex: number
}

const nullCardAddress = Object.freeze({
  section: null, // null is from external (Search, or Binder)
  columnIndex: -1,
})

/**
 * Dragging
 */
const currentlyDragging = ref<ICard>()
const origin = ref<CardAddress>(nullCardAddress)
const destination = ref<CardAddress>(nullCardAddress)
const destinationIndex = ref(-1)

function clearDragState() {
  currentlyDragging.value = undefined
  origin.value = nullCardAddress
  destination.value = nullCardAddress
  destinationIndex.value = -1
}

function handleDragOver(section: ICard[][], columnIndex: number) {
  destination.value = {
    section,
    columnIndex,
  }
}

function handleDragstart(section: ICard[][], columnIndex: number, card: ICard) {
  currentlyDragging.value = card
  origin.value = {
    section,
    columnIndex,
  }
}

function handleSearchResultDragstart(card: ICard) {
  currentlyDragging.value = { ...card } // always want a new instance when dragging from start
  origin.value = nullCardAddress
}

function updateDestinationIndex(afterUuId: string): void {
  const { section, columnIndex } = destination.value
  const dropIndex = section![columnIndex].findIndex(
    card => card.uuid === afterUuId
  )
  if (dropIndex > -1) destinationIndex.value = dropIndex + 1
}

function getCardDropTarget(e: DragEvent): ICard | undefined {
  const targetUuid = e.target && (e.target as HTMLDivElement).id

  // if no dropTarget (ICard)
  if (!targetUuid) return undefined

  const { section, columnIndex } = destination.value
  return section![columnIndex].find(card => card.uuid === targetUuid)
}

function handleDrop(
  e: DragEvent,
  section: ICard[][],
  columnIndex: number,
  forceCardIndex = -1
) {
  if (!currentlyDragging.value) return

  const cardDropTarget = getCardDropTarget(e)

  // if dropTarget is self
  if (
    cardDropTarget &&
    cardDropTarget?.uuid === currentlyDragging.value?.uuid
  ) {
    return
  }

  if (cardDropTarget) updateDestinationIndex(cardDropTarget.uuid!)

  if (forceCardIndex > -1) destinationIndex.value = forceCardIndex

  const destinationIsNewColumn =
    destination.value.section !== origin.value.section ||
    (destination.value.section === origin.value.section &&
      destination.value.columnIndex !== origin.value.columnIndex)

  if (destinationIsNewColumn) {
    // add a new column if dropping in last
    if (columnIndex + 1 === section.length) {
      section.push([])
    }

    // remove card from origin, add to destination
    if (origin.value.section) {
      handleDelete(
        origin.value.section,
        origin.value.columnIndex,
        currentlyDragging.value
      )
    } else {
      currentlyDragging.value.uuid = uuid()
    }

    // insert card
    handleInsert(
      destination.value.section!,
      destination.value.columnIndex,
      currentlyDragging.value,
      destinationIndex.value
    )
  } else {
    // reorder
    moveCard(
      origin.value.section!,
      origin.value.columnIndex,
      currentlyDragging.value.uuid!,
      destinationIndex.value
    )
  }

  clearDragState()
}

/**
 * Card Actions
 */
/**
 * Find the card in the column, and then move it to its new index.
 */
function moveCard(
  section: ICard[][],
  columnIndex: number,
  cardUuid: string,
  newIdx: number
): void {
  const currentIdx = section[columnIndex].findIndex(
    card => card.uuid === cardUuid
  )

  if (currentIdx < 0 || currentIdx === newIdx) return

  // take self being removed first into account
  const buffer = newIdx > currentIdx ? -1 : 0

  // move item in array
  const copy = [...section[columnIndex]]
  copy.splice(newIdx + buffer, 0, copy.splice(currentIdx, 1)[0])
  section[columnIndex] = copy
}

/**
 * Find the card in the column, and clone it with a new uuid.
 */
function handleDuplicate(
  section: ICard[][],
  columnIndex: number,
  card: ICard
): void {
  const currentIdx = section[columnIndex].findIndex(c => c.id === card.id)

  const copy = [...section[columnIndex]]
  copy.splice(currentIdx, 0, {
    ...card,
    uuid: uuid(),
  })
  section[columnIndex] = copy
}

/**
 * Find all instances of card in the column,
 * and increase the number to 4.
 */
function handlePlayset(
  section: ICard[][],
  columnIndex: number,
  card: ICard
): void {
  // count instances of card 'id'
  let currentCount = section[columnIndex].filter(c => c.id === card.id).length

  // generate new cards
  const newCards = []
  while (currentCount < 4) {
    newCards.push({
      ...card,
      uuid: uuid(),
    })
    currentCount++
  }

  // insert new cards before(?) selected card
  const index = section[columnIndex].findIndex(c => c.uuid === card.uuid)
  section[columnIndex] = [
    ...section[columnIndex].slice(0, index),
    ...newCards,
    ...section[columnIndex].slice(index),
  ]
}

/**
 * Inser the card into the column at the instertion index.
 */
function handleInsert(
  section: ICard[][],
  columnIndex: number,
  card: ICard,
  insertionIndex: number
): void {
  const copy = [...section[columnIndex]]
  copy.splice(insertionIndex > -1 ? insertionIndex : copy.length, 0, card)
  section[columnIndex] = copy
}

/**
 * Find the card in the column, and remove it.
 */
function handleDelete(
  section: ICard[][],
  columnIndex: number,
  card: ICard
): void {
  section[columnIndex] = section[columnIndex].filter(c => c.uuid !== card.uuid)
}
</script>

<template>
  <CardSearch @dragstart="handleSearchResultDragstart" />

  <div
    class="flex flex-1 px-4 overflow-x-auto bg-transparent gap-x-2 min-w-screen"
  >
    <DeckbuilderMain>
      <!-- <DeckbuilderCommander /> -->
      <DeckbuilderSection
        title="Mainboard"
        alignment="left"
        :section-data="mainboard"
        @dragstart="(card, colIdx) => handleDragstart(mainboard, colIdx, card)"
        @dragover="colIdx => handleDragOver(mainboard, colIdx)"
        @drop="
          (e, colIdx, forceCardIdx) =>
            handleDrop(e, mainboard, colIdx, forceCardIdx)
        "
        @duplicate="(card, colIdx) => handleDuplicate(mainboard, colIdx, card)"
        @playset="(card, colIdx) => handlePlayset(mainboard, colIdx, card)"
        @delete="(card, colIdx) => handleDelete(mainboard, colIdx, card)"
      />
      <DeckbuilderSection
        title="Maybes"
        :total-cards-required="Infinity"
        :section-data="maybes"
        @dragstart="(card, colIdx) => handleDragstart(maybes, colIdx, card)"
        @dragover="colIdx => handleDragOver(maybes, colIdx)"
        @drop="
          (e, colIdx, forceCardIdx) =>
            handleDrop(e, maybes, colIdx, forceCardIdx)
        "
        @duplicate="(card, colIdx) => handleDuplicate(maybes, colIdx, card)"
        @playset="(card, colIdx) => handlePlayset(maybes, colIdx, card)"
        @delete="(card, colIdx) => handleDelete(maybes, colIdx, card)"
      />
    </DeckbuilderMain>

    <DeckbuilderSide>
      <DeckbuilderSection
        title="Sideboard"
        :total-cards-required="15"
        :section-data="sideboard"
        @dragstart="(card, colIdx) => handleDragstart(sideboard, colIdx, card)"
        @dragover="colIdx => handleDragOver(sideboard, colIdx)"
        @drop="
          (e, colIdx, forceCardIdx) =>
            handleDrop(e, sideboard, colIdx, forceCardIdx)
        "
        @duplicate="(card, colIdx) => handleDuplicate(sideboard, colIdx, card)"
        @playset="(card, colIdx) => handlePlayset(sideboard, colIdx, card)"
        @delete="(card, colIdx) => handleDelete(sideboard, colIdx, card)"
      />
    </DeckbuilderSide>
  </div>
</template>
