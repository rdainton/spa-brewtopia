import { shallowMount } from '@vue/test-utils'

// Fixtures
import { mockSearchResults } from '../../../jest/fixtures/cards'

// Components
import SearchResults from '@/components/molecules/SearchResults.vue'
import Card from '@/components/molecules/Card.vue'
import CardSkeleton from '@/components/atoms/CardSkeleton.vue'

describe('SearchResults.vue', () => {
  test('skeleton content is rendered while searching', async () => {
    const wrapper = shallowMount(SearchResults, {
      props: {
        searching: false,
        results: [],
      },
    })

    expect(wrapper.findComponent(CardSkeleton).exists()).toBe(false)

    await wrapper.setProps({ searching: true })

    expect(wrapper.findComponent(CardSkeleton).exists()).toBe(true)
  })

  it('displays "No results found" it has search, but got no results', async () => {
    const wrapper = shallowMount(SearchResults, {
      props: {
        searching: true,
        results: [],
      },
    })

    await wrapper.setProps({ searching: false })

    expect(wrapper.text()).toContain('No results found.')
  })

  it('displays search results', () => {
    const wrapper = shallowMount(SearchResults, {
      props: {
        searching: false,
        results: mockSearchResults,
      },
    } as any)

    const results = wrapper.findAllComponents(Card)

    expect(results).toHaveLength(mockSearchResults.length)
  })

  it('emits a "dragstart" event on "dragstart" of a search result, with full card details', async () => {
    const wrapper = shallowMount(SearchResults, {
      props: {
        searching: false,
        results: mockSearchResults,
      },
    } as any)

    const result = wrapper.getComponent(Card)
    await result.trigger('dragstart')

    expect(wrapper.emitted('dragstart')).toHaveLength(1)
    expect(wrapper.emitted('dragstart')).toStrictEqual([[mockSearchResults[0]]])
  })

  it('emits a "dblclick" event on "dblclick" of a search result, with full card details', async () => {
    const wrapper = shallowMount(SearchResults, {
      props: {
        searching: false,
        results: mockSearchResults,
      },
    } as any)

    const result = wrapper.getComponent(Card)
    await result.trigger('dblclick')

    expect(wrapper.emitted('dblclick')).toHaveLength(1)
    expect(wrapper.emitted('dblclick')).toStrictEqual([[mockSearchResults[0]]])
  })
})
