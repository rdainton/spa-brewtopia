import { ScryfallCard } from '@/apis/scryfall/types'

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
}

export interface StoreableCard extends ScryfallCard {
  cardType: PrimaryCardType
  flatColors: string
}

export type CardList = ICard[]

export type CardSection = CardList[]

export enum CardSections {
  MAINBOARD = 'mainboard',
  SIDEBOARD = 'sideboard',
  MAYBES = 'maybes',
}
export interface CardAddress {
  section: ICard[][] | null
  columnIndex: number
}

export type DecklistContent = {
  mainboard: CardSection
  sideboard: CardSection
  maybes: CardSection
}

export type Decklist = {
  id: number
  name: string
  decklist: DecklistContent
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
