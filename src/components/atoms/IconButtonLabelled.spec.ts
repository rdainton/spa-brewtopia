import { mount, shallowMount } from '@vue/test-utils'
import IconButtonLabelled from '@/components/atoms/IconButtonLabelled.vue'

const props = {
  label: 'Test',
}

describe('atoms/IconButtonLabelled.vue', () => {
  test('renders an svg icon', () => {
    const wrapper = mount(IconButtonLabelled)

    const icon = wrapper.findAll('svg')

    expect(icon).toHaveLength(1)
  })

  test('emits a click event', () => {
    const wrapper = shallowMount(IconButtonLabelled)

    wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
