import { shallowMount } from '@vue/test-utils'
import BrewText from '@/components/atoms/BrewText.vue'

const config = {
  slots: {
    default: 'Testing',
  },
}

describe('atoms/BrewText.vue', () => {
  it('should semantically render "p" tags', () => {
    const wrapper = shallowMount(BrewText, config)

    const p = wrapper.find('p')

    expect(p.exists()).toBe(true)
  })

  it('should render slot content', () => {
    const wrapper = shallowMount(BrewText, config)

    expect(wrapper.text()).toEqual(config.slots.default)
    wrapper.unmount()
  })
})
