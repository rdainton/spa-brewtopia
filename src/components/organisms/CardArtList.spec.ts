import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import brewtopia from '@/apis/brewtopia'

// Types
import { CardRaw, SearchResponse } from '@/apis/brewtopia/cards'

// Fixtures
import { createAxiosSuccessResponseMock } from '../../../testing/helpers'
import { mockArtsResults } from '../../../testing/fixtures/cards'

// Components
import CardArtList from '@/components/organisms/CardArtList.vue'
import Card from '@/components/molecules/Card.vue'
import CardSkeleton from '@/components/atoms/CardSkeleton.vue'
import BrewTitle from '@/components/atoms/BrewTitle.vue'
import BrewPaginator from '@/components/molecules/BrewPaginator.vue'

vi.mock('@/config')

const config = {
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          card: {
            cards: {
              [mockArtsResults[0].id]: mockArtsResults[0],
            },
          },
        },
      }),
    ],
  },
  props: {
    cardId: mockArtsResults[0].id,
  },
}

const mockSuccessResponse = createAxiosSuccessResponseMock<SearchResponse>({
  results: mockArtsResults as CardRaw[],
  hasMore: true,
})

describe('CardArtList.vue', () => {
  const apiSpy = vi.spyOn(brewtopia.cards, 'arts')
  beforeEach(() => {
    apiSpy.mockResolvedValueOnce(mockSuccessResponse)
  })

  afterEach(() => {
    apiSpy.mockClear()
  })

  test('arts are fetched automatically on mount', () => {
    shallowMount(CardArtList, config)

    expect(apiSpy).toHaveBeenCalledTimes(1)
  })

  test('skeleton content is rendered while fetching', () => {
    const wrapper = shallowMount(CardArtList, config as any)

    expect(wrapper.findComponent(CardSkeleton).exists()).toBe(true)
  })

  it('displays "No arts found" if has fetched, but got no results', async () => {
    vi.resetAllMocks()
      .spyOn(brewtopia.cards, 'arts')
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

  it('gives the option to "Load more" if the results are paginatable', async () => {
    const wrapper = mount(CardArtList, config as any)

    await flushPromises()
    const paginator = wrapper.findComponent(BrewPaginator)

    expect(paginator.exists()).toBe(true)
    expect(paginator.text()).toContain('Load more')
  })

  it('Loading more calls the api with pagination params', async () => {
    const wrapper = mount(CardArtList, config as any)
    await flushPromises()

    apiSpy.mockClear()
    apiSpy.mockResolvedValueOnce(mockSuccessResponse)
    const paginator = wrapper.getComponent(BrewPaginator)
    await paginator.vm.$emit('paginate')

    // page 2
    expect(apiSpy).toHaveBeenCalledWith(mockArtsResults[0].name, 2)
  })

  test('displayed results are paginated', async () => {
    const wrapper = mount(CardArtList, config as any)
    await flushPromises()

    apiSpy.mockClear()
    apiSpy.mockResolvedValueOnce(mockSuccessResponse)
    const paginator = wrapper.getComponent(BrewPaginator)
    await paginator.vm.$emit('paginate')
    await flushPromises()

    const results = wrapper.findAllComponents(Card)
    // orginal plus page 2 results
    expect(results).toHaveLength(
      mockArtsResults.length + mockArtsResults.length
    )
  })
})
