import { mount, shallowMount } from '@vue/test-utils'
import IconButtonConfirmable from '@/components/atoms/IconButtonConfirmable.vue'

describe('atoms/IconButtonConfirmable.vue', () => {
  test('renders an svg icon', () => {
    const wrapper = mount(IconButtonConfirmable)

    const icon = wrapper.findAll('svg')

    expect(icon).toHaveLength(1)
  })

  test('renders additional "Confirm" text after first click', async () => {
    const wrapper = shallowMount(IconButtonConfirmable)

    expect(wrapper.text()).not.toContain('Confirm')

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('Confirm')
  })

  test('emits a click event only after clicking twice', async () => {
    const wrapper = shallowMount(IconButtonConfirmable)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).not.toHaveProperty('clicked')

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('clicked')
  })
})
