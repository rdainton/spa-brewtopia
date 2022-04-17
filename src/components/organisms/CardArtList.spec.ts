import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import scryfall from '@/apis/scryfall'
import { ScryfallCard } from '@/apis/scryfall/types'
import { SearchResponse } from '@/apis/scryfall/search'

// Fixtures
import { createAxiosSuccessResponseMock } from '../../../jest/helpers'
import { mockArtsResults } from '../../../jest/fixtures/cards'

// Stores
import { useCardStore } from '@/stores/useCardStore'

// Components
import CardArtList from '@/components/organisms/CardArtList.vue'
import Card from '@/components/molecules/Card.vue'
import CardSkeleton from '@/components/atoms/CardSkeleton.vue'
import BrewTitle from '@/components/atoms/BrewTitle.vue'

jest.mock('@/config')
jest.mock('@/apis/scryfall')

const config = {
  global: {
    plugins: [createTestingPinia()],
  },
  props: {
    cardId: mockArtsResults[0].id,
  },
}

const mockSuccessResponse = createAxiosSuccessResponseMock<SearchResponse>({
  data: mockArtsResults as ScryfallCard[],
})

describe('CardArtList.vue', () => {
  beforeAll(() => {
    useCardStore().add(mockArtsResults[0] as ScryfallCard)
  })

  const apiSpy = jest.spyOn(scryfall.search, 'arts')
  beforeEach(() => {
    apiSpy.mockResolvedValueOnce(mockSuccessResponse)
  })

  afterEach(() => jest.resetAllMocks())

  test('arts are fetched automatically on mount', async () => {
    shallowMount(CardArtList, config)

    expect(apiSpy).toHaveBeenCalledTimes(1)
  })

  test('skeleton content is rendered while fetching', async () => {
    const wrapper = shallowMount(CardArtList, config as any)

    expect(wrapper.findComponent(CardSkeleton).exists()).toBe(true)
  })

  it('displays "No arts found" if has fetched, but got no results', async () => {
    jest
      .resetAllMocks()
      .spyOn(scryfall.search, 'arts')
      .mockRejectedValueOnce({
        response: { data: { status: 404 } },
      })
    const wrapper = shallowMount(CardArtList, config as any)
    await flushPromises()

    expect(wrapper.text()).toContain('No arts found.')
  })

  it('displays results', async () => {
    const wrapper = shallowMount(CardArtList, config as any)
    await flushPromises()

    const results = wrapper.findAllComponents(Card)
    expect(results).toHaveLength(mockArtsResults.length)
  })

  it('displays the card name based on the scryId prop', () => {
    const wrapper = mount(CardArtList, config as any)

    const title = wrapper.getComponent(BrewTitle)
    expect(title.text()).toContain(mockArtsResults[0].name)
  })
})
