import brewtopiaClient, { apiPrefix } from './client'

export type ManaColor = 'B' | 'U' | 'R' | 'G' | 'R'

export interface CardFace {
  imgUrl?: string
  imgUrlLarge?: string
  name: string
  manaCost?: string
  typeLine: string
  oracleText?: string
  power?: string
  toughness?: string
}
export interface CardRaw {
  id: string
  name: string
  cmc: number
  manaCost?: string // dual-faced don't have a mana cost here
  typeLine: string
  colors?: ManaColor[]
  colorIdentity: ManaColor[]
  power?: string
  toughness?: string
  cardFaces?: CardFace[]
  imgUrl?: string
  imgUrlLarge?: string
  oracleText?: string
  set: string
  setName: string
  setType: string
}

export interface IdentifiableScryId {
  id: string
}

export interface IdentifiableName {
  name: string
}

export interface IdentifiableSetName {
  name: string
  set: string
}

export type Identifiable =
  | IdentifiableName
  | IdentifiableSetName
  | IdentifiableScryId

export interface SearchResponse {
  results: CardRaw[]
  hasMore: boolean
}

interface CollectionResponse {
  missing: Identifiable[]
  collection: CardRaw[]
}

/**
 * The Brewtopia cards services
 */
export default {
  search(searchTerm: string) {
    return brewtopiaClient.get<SearchResponse>(
      `${apiPrefix}/cards/search?q=${searchTerm}`
    )
  },

  arts(cardName: string, page = 1) {
    return brewtopiaClient.get<SearchResponse>(
      `${apiPrefix}/cards/arts?name=${cardName}&page=${page}`
    )
  },

  collection(identifiables: Identifiable[]) {
    return brewtopiaClient.post<CollectionResponse>(
      `${apiPrefix}/cards/collection`,
      {
        identifiables,
      }
    )
  },
}
