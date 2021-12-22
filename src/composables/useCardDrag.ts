import { ref } from 'vue'
import { v4 as uuid } from 'uuid'
import { CardActions, ICard, CardAddress } from '../types/cards'

const nullCardAddress = Object.freeze({
  section: null, // null is from external (Search, or Binder)
  columnIndex: -1,
})

/**
 * Primary logic for moving an ICard around the UI.
 * TODO: clean this hook up, make better use of CardAddress? unify the exposed dragstart functions
 */
export default function useCardDrag(cardActions: CardActions) {
  const currentlyDragging = ref<ICard>()
  const origin = ref<CardAddress>(nullCardAddress)
  const destination = ref<CardAddress>(nullCardAddress)
  const destinationIndex = ref(-1)

  function reset() {
    currentlyDragging.value = undefined
    origin.value = nullCardAddress
    destination.value = nullCardAddress
    destinationIndex.value = -1
  }

  function handleDragover(section: ICard[][], columnIndex: number): void {
    destination.value = {
      section,
      columnIndex,
    }
  }

  function handleDragstart(
    section: ICard[][],
    columnIndex: number,
    card: ICard
  ): void {
    currentlyDragging.value = card
    origin.value = {
      section,
      columnIndex,
    }
  }

  function handleNullOriginDragstart(card: ICard): void {
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
  ): void {
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
