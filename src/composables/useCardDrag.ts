import { ref } from 'vue'
import { v4 as uuid } from 'uuid'
import { CardActions, CardProxy, CardAddress, CardSection } from '@/types/cards'

const nullCardAddress = Object.freeze({
  section: null, // null is from external (Search, or Binder)
  columnIndex: -1,
})

/**
 * Primary logic for moving an CardProxy around the UI.
 * TODO: clean this hook up, make better use of CardAddress? unify the exposed dragstart functions
 */
export default function useCardDrag(cardActions: CardActions) {
  const currentlyDragging = ref<CardProxy>()
  const origin = ref<CardAddress>(nullCardAddress)
  const destination = ref<CardAddress>(nullCardAddress)
  const destinationIndex = ref(-1)

  const reset = () => {
    currentlyDragging.value = undefined
    origin.value = nullCardAddress
    destination.value = nullCardAddress
    destinationIndex.value = -1
  }

  const handleDragover = (section: CardSection, columnIndex: number): void => {
    destination.value = {
      section,
      columnIndex,
    }
  }

  const handleDragstart = (
    section: CardSection,
    columnIndex: number,
    card: CardProxy
  ): void => {
    currentlyDragging.value = card
    origin.value = {
      section,
      columnIndex,
    }
  }

  const handleNullOriginDragstart = (card: CardProxy): void => {
    currentlyDragging.value = { ...card } // always want a new instance when dragging from start
    origin.value = nullCardAddress
  }

  const updateDestinationIndex = (afterUuId: string): void => {
    const { section, columnIndex } = destination.value
    const dropIndex = section![columnIndex].findIndex(
      card => card.uuid === afterUuId
    )
    if (dropIndex > -1) destinationIndex.value = dropIndex + 1
  }

  const getCardDropTarget = (e: DragEvent): CardProxy | undefined => {
    const targetUuid = e.target && (e.target as HTMLDivElement).id

    // if no dropTarget (CardProxy)
    if (!targetUuid) return undefined

    const { section, columnIndex } = destination.value
    return section![columnIndex].find(card => card.uuid === targetUuid)
  }

  const handleDrop = (
    e: DragEvent,
    section: CardSection,
    columnIndex: number,
    forceCardIndex = -1
  ): void => {
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
        cardActions.remove(
          origin.value.section,
          origin.value.columnIndex,
          currentlyDragging.value
        )
      } else {
        currentlyDragging.value.uuid = uuid()
      }

      // insert card
      cardActions.insertAtIndex(
        destination.value.section!,
        destination.value.columnIndex,
        currentlyDragging.value,
        destinationIndex.value
      )
    } else {
      // reorder
      cardActions.moveIndex(
        origin.value.section!,
        origin.value.columnIndex,
        currentlyDragging.value,
        destinationIndex.value
      )
    }

    reset()
  }

  return {
    handleDragover,
    handleDragstart,
    handleNullOriginDragstart,
    handleDrop,
  }
}
