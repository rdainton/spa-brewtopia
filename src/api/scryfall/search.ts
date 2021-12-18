import scryfall from './'

interface ScryfallCard {
  id: string
  name: string
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
