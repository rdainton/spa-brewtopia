export interface ICard {
  id: string
  uuid?: string
  imgUrl: string
  name: string
  manaValue: number
}

export type CardList = ICard[]

export type CardSection = CardList[]
export interface CardAddress {
  section: ICard[][] | null
  columnIndex: number
}

/**
 * Return signature for useCardActions hook
 */
export interface CardActions {
  moveIndex(
    section: ICard[][],
    columnIndex: number,
    card: ICard,
    newIdx: number
  ): void
  duplicate(section: ICard[][], columnIndex: number, card: ICard): void
  toPlayset(section: ICard[][], columnIndex: number, card: ICard): void
  insertAtIndex(
    section: ICard[][],
    columnIndex: number,
    card: ICard,
    insertionIndex: number
  ): void
  remove(ection: ICard[][], columnIndex: number, card: ICard): void
}
