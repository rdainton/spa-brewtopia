import scryfallClient from './client'
import { ScryfallCard } from './types'

interface IdendifiableScryId {
  id: string
}

interface IdendifiableName {
  name: string
}

interface IdendifiableSetName {
  name: string
  set: string
}

export type Identifiable =
  | IdendifiableName
  | IdendifiableSetName
  | IdendifiableScryId

interface CollectionResponse {
  not_found: Identifiable[]
  data: ScryfallCard[]
}

/**
 * The Scryfall collection services
 */
export default {
  all(identifiables: Identifiable[]) {
    return scryfallClient.post<CollectionResponse>(
      '/cards/collection',
      identifiables
    )
  },
}
