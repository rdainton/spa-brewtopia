import scryfallClient from './client'
import { ScryfallCard } from './types'

export interface SearchResponse {
  data: ScryfallCard[]
}

/**
 * The Scryfall search services
 */
export default {
  simple(searchTerm: string) {
    return scryfallClient.get<SearchResponse>(`/cards/search?q=${searchTerm}`)
  },
}
