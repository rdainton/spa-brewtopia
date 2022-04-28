import { shallowMount, mount } from '@vue/test-utils'
import { v4 as uuid } from 'uuid'
import { ScryfallCard } from '@/apis/scryfall/types'

// Fixtures
import { singleFacedCard } from '../../../jest/fixtures/card'

// Components
import Card from '@/components/molecules/Card.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import EditIcon from '@/components/atoms/icons/EditIcon.vue'

const cardProxy = {
  uuid: uuid(),
  scryId: singleFacedCard.id,
}

const props = {
  id: cardProxy.uuid,
  data: singleFacedCard as ScryfallCard,
  cardProxy,
}

describe('Card.vue', () => {
  describe('controls', () => {
    it('only displays controls when withControls is true', async () => {
      const wrapper = shallowMount(Card, {
        props: { ...props, withControls: false },
      } as any)
      const noControls = wrapper.findAllComponents(IconButton)
      expect(noControls).toHaveLength(0)

      await wrapper.setProps({ withControls: true })
      const controls = wrapper.findAllComponents(IconButton)

      expect(controls.length).toBeGreaterThan(0)
    })

    it('should emit a "change-art" event when the button is clicked', async () => {
      const wrapper = mount(Card, {
        props: { ...props, withControls: true },
      } as any)
      const changeArtIcon = wrapper.getComponent(EditIcon)

      await changeArtIcon.trigger('click')

      expect(wrapper.emitted('change-art')).toHaveLength(1)
    })
  })
})
