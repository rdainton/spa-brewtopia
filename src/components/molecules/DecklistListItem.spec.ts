import { shallowMount } from '@vue/test-utils'
import moment from 'moment'
import DecklistListItem from '@/components/molecules/DecklistListItem.vue'

const props = {
  name: 'Hello world',
  createdAt: new Date().toISOString(),
  coverImageUrl:
    'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/6/9/69daba76-96e8-4bcc-ab79-2f00189ad8fb.jpg?1619398799',
}

describe('molecules/DecklistListItem.vue', () => {
  test('should render the decklist name', () => {
    const wrapper = shallowMount(DecklistListItem, {
      props,
    })

    expect(wrapper.text()).toContain('Hello world')
  })

  test('should render the decklist createdAt by default', () => {
    const wrapper = shallowMount(DecklistListItem, {
      props,
    })

    expect(wrapper.text()).toContain(
      moment(props.createdAt).format('MMMM Do YYYY')
    )
  })

  test('emits a "load" event passing the decklist id when the load button is clicked', async () => {
    const wrapper = shallowMount(DecklistListItem, {
      props,
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('load')).toHaveLength(1)
  })

  test('should render the cover image if there is one', () => {
    const wrapper = shallowMount(DecklistListItem, {
      props,
    })

    expect(
      wrapper.get('button').element.style.getPropertyValue('background-image')
    ).toBe(`url(${props.coverImageUrl})`)
  })
})
