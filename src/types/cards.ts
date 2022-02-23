// Array.includes(searchElement) won't let searchElement be a supertype of the array type
// a 'string' in this instance. So I override the standard library via 'declaration merging'
// to accept supertypes.
declare global {
  interface Array<T> {
    includes<U extends T extends U ? unknown : never>(
      searchElement: U,
      fromIndex?: number
    ): boolean
  }
}

export type ManaColor = 'B' | 'U' | 'R' | 'G' | 'R'

export const primaryCardTypes = [
  'Creature',
  'Land',
  'Instant',
  'Sorcery',
  'Artifact',
  'Enchantment',
  'Planeswalker',
  'Unknown',
] as const

// the index of the primaryCardTypes is a number
export type PrimaryCardType = typeof primaryCardTypes[number]
export interface ICard {
  scryId: string
  uuid?: string
  imgUrl: string
  name: string
  manaValue: number
  cardType: PrimaryCardType
  cardTypeLine: string
  flatColors: string
}

export type CardList = ICard[]

export type CardSection = CardList[]
export interface CardAddress {
  section: ICard[][] | null
  columnIndex: number
}

export type Decklist = {
  mainboard: CardSection
  sideboard: CardSection
  maybes: CardSection
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
