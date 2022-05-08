import useCardActions from '@/composables/useCardActions'
import { DecklistContent, CardProxy } from '@/types/cards'
import { v4 as uuid } from 'uuid'

const CARD_1_ID = 'card_1_ID'
const CARD_2_ID = 'card_2'
const CARD_3_ID = 'card_3'

function createMockCardProxy(cardId: string): CardProxy {
  return {
    scryId: cardId,
    uuid: uuid(),
  }
}

function createMockDecklistContent(): DecklistContent {
  return {
    mainboard: [
      [
        createMockCardProxy(CARD_1_ID),
        createMockCardProxy(CARD_1_ID),
        createMockCardProxy(CARD_2_ID),
        createMockCardProxy(CARD_2_ID),
      ],
      [],
    ],
    sideboard: [
      [createMockCardProxy(CARD_3_ID)],
      [createMockCardProxy(CARD_1_ID)],
    ],
    maybes: [[], []],
  }
}

describe('useCardActions.ts', () => {
  const onComplete = vi.fn()
  const cardActions = useCardActions(onComplete)

  afterEach(() => {
    onComplete.mockReset()
  })

  describe('changeCardId', () => {
    test('onComplete is called when a valid function', () => {
      cardActions.changeCardId(
        createMockDecklistContent(),
        CARD_1_ID,
        'new-card-id'
      )

      expect(onComplete).toHaveBeenCalled()
    })

    test('the cardId is changed for all matches', () => {
      const decklist = createMockDecklistContent()
      const newId = 'new-card-id'
      cardActions.changeCardId(decklist, CARD_1_ID, newId)

      expect(decklist.mainboard[0][0].scryId === newId)
      expect(decklist.mainboard[0][1].scryId === newId)
      expect(decklist.sideboard[1][0].scryId === newId)
    })

    test('only the cards with a matching cardId are affected', () => {
      const decklist = createMockDecklistContent()
      const newId = 'new-card-id'
      cardActions.changeCardId(decklist, CARD_1_ID, newId)

      expect(decklist.mainboard[0][2].scryId === CARD_2_ID)
      expect(decklist.mainboard[0][3].scryId === CARD_2_ID)
      expect(decklist.sideboard[0][0].scryId === CARD_3_ID)
    })
  })
})
