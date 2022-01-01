import scryfall from './'
import { ManaColor } from '../../types/cards'
interface ScryfallCard {
  id: string
  name: string
  cmc: number
  type_line: string
  colors?: ManaColor[]
  color_identity?: ManaColor[]
  image_uris: {
    normal?: string
  }
}

export default {
  search(searchTerm: string) {
    return scryfall.get<{ data: ScryfallCard[] }>(
      `/cards/search?q=${searchTerm}`
    )
  },
}
