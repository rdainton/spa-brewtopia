import { defineStore } from 'pinia'
import scryfall, { ErrorMap } from '@/apis/scryfall'
import { IdentifiableScryId } from '@/apis/scryfall/collection'
import { ScryfallCard } from '@/apis/scryfall/types'
import {
  StoreableCard,
  DecklistContent,
  CardProxy,
  PrimaryCardType,
  primaryCardTypes,
} from '@/types/cards'

interface State {
  cards: Record<string, StoreableCard>
  updating: boolean
  error: ErrorMap | null
}

const cardTypesArray = primaryCardTypes.filter(t => t !== 'Unknown')

function getPrimaryCardType(typeLine: string): PrimaryCardType {
  // can the below be replaced by a regex?
  const arr = typeLine.split(' ')
  for (const word of arr) {
    if (cardTypesArray.includes(word)) {
      return word as PrimaryCardType
    }
  }

  return 'Unknown'
}

export const useCardStore = defineStore('card', {
  state: (): State => ({
    cards: {},
    updating: false,
    error: null,
  }),

  actions: {
    mapDecklistToIdentifiables(
      decklist: DecklistContent
    ): IdentifiableScryId[] {
      const sections = Object.values(decklist)

      const scryIdList = sections.reduce((ids, section) => {
        ids = [
          ...ids,
          ...section.reduce((ids, cardList) => {
            ids = [...ids, ...cardList.map(card => card.scryId)]
            return ids
          }, [] as CardProxy['scryId'][]),
        ]
        return ids
      }, [] as CardProxy['scryId'][])

      const uniqueIds = [...new Set(scryIdList)]

      return uniqueIds.map(scryId => ({
        id: scryId,
      }))
    },

    filterRedundantIdentifiables(identifiables: IdentifiableScryId[]) {
      return identifiables.filter(({ id }) => !this.cards.hasOwnProperty(id))
    },

    chunkIdentifiables(
      identifiables: IdentifiableScryId[]
    ): IdentifiableScryId[][] {
      // scryfall api asked to limit to 75 idenifiables per request.
      const CHUNK_SIZE = 75

      return identifiables.reduce((chunkedIdentifiables, item, index) => {
        const chunkIndex = Math.floor(index / CHUNK_SIZE) // allocate a chunk

        if (!chunkedIdentifiables[chunkIndex]) {
          chunkedIdentifiables[chunkIndex] = [] // start a new chunk
        }

        chunkedIdentifiables[chunkIndex].push(item)

        return chunkedIdentifiables
      }, [] as IdentifiableScryId[][])
    },

    async getCollectionForDecklist(decklist: DecklistContent) {
      if (this.updating) return

      this.updating = true

      const identifiables = this.filterRedundantIdentifiables(
        this.mapDecklistToIdentifiables(decklist)
      )

      const chunks = this.chunkIdentifiables(identifiables)
      const promises = chunks.map(chunk => scryfall.collection.all(chunk))

      return Promise.all(promises)
        .then(responses => {
          for (const response of responses) {
            for (const result of response.data.data) {
              this.add(result)
            }
          }

          return true
        })
        .catch(err => {
          this.error = err
          throw err
        })
        .finally(() => [(this.updating = false)])
    },

    mapSearchResultoStoreable(result: ScryfallCard): StoreableCard {
      const colorsArr = result.colors || result.color_identity || []

      return {
        ...result,
        cardType: getPrimaryCardType(result.type_line),
        flatColors: colorsArr.join(),
      }
    },

    add(result: ScryfallCard) {
      const storable = this.mapSearchResultoStoreable(result)
      this.cards[storable.id] = storable
    },

    delete(card: CardProxy) {
      if (this.cards.hasOwnProperty(card.scryId)) {
        delete this.cards[card.scryId]
      }
    },
  },
})
