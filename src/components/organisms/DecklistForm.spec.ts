// on blur, the value is reversed
// on submit, the form becomes readonly, and the new value is emit as a 'updated' event
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import DecklistForm from '@/components/organisms/DecklistForm.vue'
import { useDecklistStore } from '@/stores/useDecklistStore'

describe('organisms/DecklistForm.vue', () => {
  test('by default the input is readonly', () => {
    const wrapper = mount(DecklistForm)

    expect(wrapper.find('input').attributes()).toHaveProperty('readonly')
  })

  test('the input value is initially set from the decklistStore.name', () => {
    const wrapper = mount(DecklistForm, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              decklist: {
                name: 'Testing',
              },
            },
          }),
        ],
      },
    })

    const decklistStore = useDecklistStore()

    const input = wrapper.find('input')

    expect(input.element.value).toBe(decklistStore.name)
  })

  test('when the form is clicked, the input is not readonly', async () => {
    const wrapper = mount(DecklistForm)

    await wrapper.find('form').trigger('click')

    expect(wrapper.find('input').attributes()).not.toHaveProperty('readonly')
  })
})
