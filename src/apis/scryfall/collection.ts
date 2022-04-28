import scryfallClient from './client'
import { CardRaw } from './types'

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

interface CollectionResponse {
  not_found: Identifiable[]
  data: CardRaw[]
}

/**
 * The Scryfall collection services
 */
export default {
  all(identifiables: Identifiable[]) {
    return scryfallClient.post<CollectionResponse>('/cards/collection', {
      identifiers: identifiables,
    })
  },
}
