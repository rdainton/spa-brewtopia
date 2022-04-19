import { shallowMount } from '@vue/test-utils'

// Components
import BrewPaginator from '@/components/molecules/BrewPaginator.vue'
import BrewButton from '@/components/molecules/BrewButton.vue'
import BrewLoading from '@/components/atoms/BrewLoading.vue'

const props = {
  paginatable: true,
  paginating: false,
}

describe('BrewPaginator.vue', () => {
  it('should only render the "Load more" button when paginatable', async () => {
    const wrapper = shallowMount(BrewPaginator, { props } as any)
    const loadMoreButton = wrapper.findComponent(BrewButton)

    expect(loadMoreButton.exists()).toBe(true)

    await wrapper.setProps({ paginatable: false })
    const empty = wrapper.findComponent(BrewButton)

    expect(empty.exists()).toBe(false)
  })
  test('clicking the "Load more" button emits a "paginate" event', async () => {
    const wrapper = shallowMount(BrewPaginator, { props } as any)
    const loadMoreButton = wrapper.findComponent(BrewButton)

    await loadMoreButton.trigger('click')

    expect(wrapper.emitted('paginate')).toHaveLength(1)
  })

  test('while paginating, only a loading icon is displayed', () => {
    const wrapper = shallowMount(BrewPaginator, {
      props: {
        ...props,
        paginating: true,
      },
    } as any)

    const empty = wrapper.findComponent(BrewButton)
    expect(empty.exists()).toBe(false)

    const spinner = wrapper.findComponent(BrewLoading)
    expect(spinner.exists()).toBe(true)
  })
})
