import scryfallClient from './client'
import { CardRaw } from './types'

export interface SearchResponse {
  data: CardRaw[]
  has_more: boolean
}

/**
 * The Scryfall search services
 */
export default {
  simple(searchTerm: string) {
    return scryfallClient.get<SearchResponse>(`/cards/search?q=${searchTerm}`)
  },

  arts(cardName: string, page = 1) {
    return scryfallClient.get<SearchResponse>(
      `/cards/search?q=${cardName}&unique=prints&order=released&page=${page}`
    )
  },
}
