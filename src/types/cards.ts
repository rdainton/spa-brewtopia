import { CardRaw } from '@/apis/brewtopia/cards'

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

export interface CardProxy {
  scryId: string
  uuid?: string
}

export interface CardStoreable extends CardRaw {
  cardType: PrimaryCardType
  flatColors: string
}

export type CardList = CardProxy[]

export type CardSection = CardList[]

export enum CardSections {
  MAINBOARD = 'mainboard',
  SIDEBOARD = 'sideboard',
  MAYBES = 'maybes',
}
export interface CardAddress {
  section: CardProxy[][] | null
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
    section: CardProxy[][],
    columnIndex: number,
    card: CardProxy,
    newIdx: number
  ): void
  duplicate(section: CardProxy[][], columnIndex: number, card: CardProxy): void
  toPlayset(section: CardProxy[][], columnIndex: number, card: CardProxy): void
  insertAtIndex(
    section: CardProxy[][],
    columnIndex: number,
    card: CardProxy,
    insertionIndex: number
  ): void
  remove(ection: CardProxy[][], columnIndex: number, card: CardProxy): void
  changeCardId(
    decklist: DecklistContent,
    currentCardId: string,
    newCardId: string
  ): void
}
