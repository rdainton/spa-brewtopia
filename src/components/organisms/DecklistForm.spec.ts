// on blur, the value is reversed
// on submit, the form becomes readonly, and the new value is emit as a 'updated' event
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'
import DecklistForm from '@/components/organisms/DecklistForm.vue'
import { useDecklistStore } from '@/stores/useDecklistStore'

jest.mock('@/config/index.ts')
jest.mock('@/apis/brewtopia/index.ts')

const config = {
  global: {
    plugins: [createTestingPinia()],
  },
}

describe('organisms/DecklistForm.vue', () => {
  test('by default the input is readonly', () => {
    const wrapper = mount(DecklistForm, config)

    expect(wrapper.find('input').attributes()).toHaveProperty('readonly')
  })

  test('the input value is initially set from the decklistStore.name', async () => {
    const wrapper = mount(DecklistForm, config)

    const decklistStore = useDecklistStore()
    decklistStore.name = 'Testing'
    await flushPromises()

    const input = wrapper.find('input')

    expect(input.element.value).toBe(decklistStore.name)
  })

  test('when the form is clicked, the input is not readonly', async () => {
    const wrapper = mount(DecklistForm, config)

    await wrapper.find('form').trigger('click')

    expect(wrapper.find('input').attributes()).not.toHaveProperty('readonly')
  })
})
