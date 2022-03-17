import { mount, shallowMount } from '@vue/test-utils'
import IconButton from '@/components/atoms/IconButton.vue'

describe('atoms/IconButton.vue', () => {
  test('renders an svg icon', () => {
    const wrapper = mount(IconButton)

    const icon = wrapper.findAll('svg')

    expect(icon).toHaveLength(1)
  })

  test('emits a click event', () => {
    const wrapper = shallowMount(IconButton)

    wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
