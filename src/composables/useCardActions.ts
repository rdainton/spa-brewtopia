import { v4 as uuid } from 'uuid'
import {
  CardProxy,
  CardActions,
  DecklistSection,
  DecklistContent,
} from '@/types/cards'

/**
 * A collection of methods to immuteably update the object<CardProxy> listing
 * within a column<CardProxy[]>, within a section<CardProxy[][]>.
 *
 * @param onComplete - optional hook called on action completion
 */
export default function useCardActions(onComplete?: () => void): CardActions {
  /**
   * Find the card in the column, and then move it to its new index.
   */
  const moveIndex = (
    section: DecklistSection,
    columnIndex: number,
    card: CardProxy,
    newIdx: number
  ): void => {
    const currentIdx = section[columnIndex].findIndex(c => c.uuid === card.uuid)

    if (currentIdx < 0 || currentIdx === newIdx) return

    // take self being removed first into account
    const buffer = newIdx > currentIdx ? -1 : 0

    // move item in array
    const copy = [...section[columnIndex]]
    copy.splice(newIdx + buffer, 0, copy.splice(currentIdx, 1)[0])
    section[columnIndex] = copy

    if (typeof onComplete === 'function') onComplete()
  }

  /**
   * Find the card in the column, and clone it with a new uuid.
   */
  const duplicate = (
    section: DecklistSection,
    columnIndex: number,
    card: CardProxy
  ): void => {
    const currentIdx = section[columnIndex].findIndex(
      c => c.scryId === card.scryId
    )

    const copy = [...section[columnIndex]]
    copy.splice(currentIdx, 0, {
      ...card,
      uuid: uuid(),
    })
    section[columnIndex] = copy

    if (typeof onComplete === 'function') onComplete()
  }

  /**
   * Find all instances of card in the column,
   * and increase the number to 4.
   */
  const toPlayset = (
    section: DecklistSection,
    columnIndex: number,
    card: CardProxy
  ): void => {
    // count instances of card 'cardId'
    let currentCount = section[columnIndex].filter(
      c => c.scryId === card.scryId
    ).length

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

    if (typeof onComplete === 'function') onComplete()
  }

  /**
   * Insert the card into the column at the instertion index.
   */
  const insertAtIndex = (
    section: DecklistSection,
    columnIndex: number,
    card: CardProxy,
    insertionIndex: number
  ): void => {
    const copy = [...section[columnIndex]]
    copy.splice(insertionIndex > -1 ? insertionIndex : copy.length, 0, card)
    section[columnIndex] = copy

    if (typeof onComplete === 'function') onComplete()
  }

  /**
   * Find the card in the column, and remove it.
   */
  const remove = (
    section: DecklistSection,
    columnIndex: number,
    card: CardProxy
  ): void => {
    section[columnIndex] = section[columnIndex].filter(
      c => c.uuid !== card.uuid
    )

    if (typeof onComplete === 'function') onComplete()
  }

  /**
   * Change cards of the matching scryId
   * to have the new scryId
   */
  const changeCardId = (
    decklist: DecklistContent,
    currentCardId: string,
    newCardId: string
  ): void => {
    let sectionKey: keyof DecklistContent
    for (sectionKey in decklist) {
      decklist[sectionKey] = decklist[sectionKey].map(col =>
        col.map(cardProxy => {
          if (cardProxy.scryId === currentCardId) {
            return {
              ...cardProxy,
              scryId: newCardId,
            }
          }
          return cardProxy
        })
      )
    }

    if (typeof onComplete === 'function') onComplete()
  }

  return {
    moveIndex,
    duplicate,
    toPlayset,
    insertAtIndex,
    remove,
    changeCardId,
  }
}
