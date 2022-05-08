import { defineStore } from 'pinia'
import brewtopia, { ErrorMap } from '@/apis/brewtopia'
import { IdentifiableScryId, CardRaw } from '@/apis/brewtopia/cards'
import {
  CardStoreable,
  DecklistContent,
  CardProxy,
  PrimaryCardType,
  primaryCardTypes,
} from '@/types/cards'

interface State {
  cards: Record<string, CardStoreable>
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

    async getCollectionForDecklist(decklist: DecklistContent) {
      if (this.updating) return

      this.updating = true

      const identifiables = this.filterRedundantIdentifiables(
        this.mapDecklistToIdentifiables(decklist)
      )

      return brewtopia.cards
        .collection(identifiables)
        .then(res => {
          for (const item of res.data.collection) {
            this.add(item)
          }

          return true
        })
        .catch(err => {
          this.error = err
          throw err
        })
        .finally(() => [(this.updating = false)])
    },

    mapSearchResultoStoreable(result: CardRaw): CardStoreable {
      const colorsArr = result.colors || result.colorIdentity || []

      return {
        ...result,
        cardType: getPrimaryCardType(result.typeLine),
        flatColors: colorsArr.join(),
      }
    },

    add(result: CardRaw) {
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
