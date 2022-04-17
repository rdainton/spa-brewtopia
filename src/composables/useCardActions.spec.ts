import useCardActions from '@/composables/useCardActions'
import { DecklistContent, ICard } from '@/types/cards'
import { v4 as uuid } from 'uuid'

const CARD_1_ID = 'card_1_ID'
const CARD_2_ID = 'card_2'
const CARD_3_ID = 'card_3'

function createMockCard(scryId: string): ICard {
  return {
    scryId,
    uuid: uuid(),
  }
}

function createMockDecklistContent(): DecklistContent {
  return {
    mainboard: [
      [
        createMockCard(CARD_1_ID),
        createMockCard(CARD_1_ID),
        createMockCard(CARD_2_ID),
        createMockCard(CARD_2_ID),
      ],
      [],
    ],
    sideboard: [[createMockCard(CARD_3_ID)], [createMockCard(CARD_1_ID)]],
    maybes: [[], []],
  }
}

describe('useCardActions.ts', () => {
  const onComplete = jest.fn()
  const cardActions = useCardActions(onComplete)

  afterEach(() => {
    onComplete.mockReset()
  })

  describe('changeScryId', () => {
    test('onComplete is called when a valid function', () => {
      cardActions.changeScryId(
        createMockDecklistContent(),
        CARD_1_ID,
        'new-card-id'
      )

      expect(onComplete).toHaveBeenCalled()
    })

    test('the scryId is changed for all matches', () => {
      const decklist = createMockDecklistContent()
      const newId = 'new-card-id'
      cardActions.changeScryId(decklist, CARD_1_ID, newId)

      expect(decklist.mainboard[0][0].scryId === newId)
      expect(decklist.mainboard[0][1].scryId === newId)
      expect(decklist.sideboard[1][0].scryId === newId)
    })

    test('only the cards with a matching scryId are affected', () => {
      const decklist = createMockDecklistContent()
      const newId = 'new-card-id'
      cardActions.changeScryId(decklist, CARD_1_ID, newId)

      expect(decklist.mainboard[0][2].scryId === CARD_2_ID)
      expect(decklist.mainboard[0][3].scryId === CARD_2_ID)
      expect(decklist.sideboard[0][0].scryId === CARD_3_ID)
    })
  })
})
