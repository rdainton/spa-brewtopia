import { mount } from '@vue/test-utils'
import { v4 as uuid } from 'uuid'
import DecklistListItem from '@/components/molecules/DecklistListItem.vue'
import DecklistListItemSkeleton from '@/components/atoms/DecklistListItemSkeleton.vue'
import DecklistList from '@/components/organisms/DecklistList.vue'

const props = {
  decklists: [
    {
      id: uuid(),
      name: 'Decklist 1',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuid(),
      name: 'Decklist 2',
      createdAt: new Date().toISOString(),
    },
  ],
  loading: false,
}

describe('organisms/DecklistList.vue', () => {
  test('renders a DecklistListItem component with data for each item in a decklists prop', () => {
    const wrapper = mount(DecklistList, {
      props,
    } as any)

    const items = wrapper.findAllComponents(DecklistListItem)

    expect(items).toHaveLength(props.decklists.length)

    items.forEach((wrapper, idx) => {
      // assert correct props are passed
      expect(wrapper.props().name).toBe(props.decklists[idx].name)
      expect(wrapper.props().createdAt).toBe(props.decklists[idx].createdAt)
    })
  })

  test('renders DecklistListItemSkeleton components when loading prop is true', () => {
    const wrapper = mount(DecklistList, {
      props: {
        ...props,
        loading: true,
      },
    } as any)

    const skeletons = wrapper.findAllComponents(DecklistListItemSkeleton)

    expect(skeletons.length).toBeGreaterThan(0)
  })
})
