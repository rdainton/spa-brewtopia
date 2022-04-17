import { shallowMount } from '@vue/test-utils'
import BrewTitle from '@/components/atoms/BrewTitle.vue'

const config = {
  slots: {
    default: 'Testing',
  },
}

describe('atoms/BrewTitle.vue', () => {
  it('should semantically render "h1" tags', () => {
    const wrapper = shallowMount(BrewTitle, config)

    const h1 = wrapper.find('h1')

    expect(h1.exists()).toBe(true)
  })

  it('should render slot content', () => {
    const wrapper = shallowMount(BrewTitle, config)

    expect(wrapper.text()).toEqual(config.slots.default)
    wrapper.unmount()
  })
})
