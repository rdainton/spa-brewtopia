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
  srcyId: string
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
