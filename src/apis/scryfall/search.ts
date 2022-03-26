import scryfallClient from './client'
import { ManaColor } from '@/types/cards'

export interface ScryfallCard {
  id: string
  name: string
  cmc: number
  mana_cost: string
  type_line: string
  colors?: ManaColor[]
  color_identity?: ManaColor[]
  image_uris: {
    normal?: string
  }
}

/**
 * The Scryfall search services
 */
export default {
  simple(searchTerm: string) {
    return scryfallClient.get<{ data: ScryfallCard[] }>(
      `/cards/search?q=${searchTerm}`
    )
  },
}
