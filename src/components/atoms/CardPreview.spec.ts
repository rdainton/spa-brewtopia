import { mount } from '@vue/test-utils'

// Types
import { CardRaw } from '@/apis/scryfall/types'

// Fixtures
import {
  singleFacedCard,
  doubleFacedCard,
  splitFacedCard,
} from '../../../jest/fixtures/card'

// Components
import CardPreview from '@/components/atoms/CardPreview.vue'
import CardPreviewImage from '@/components/atoms/CardPreviewImage.vue'
import CardPreviewDescription from '@/components/atoms/CardPreviewDescription.vue'

describe('atoms/CardPreview.vue', () => {
  describe('Single face', () => {
    const config = {
      props: {
        cardData: singleFacedCard as CardRaw,
        yPosition: 'top',
      } as any,
      global: {
        stubs: ['Teleport'],
      },
    }

    it('should render one image and one description', () => {
      const wrapper = mount(CardPreview, config)

      expect(wrapper.findAllComponents(CardPreviewImage)).toHaveLength(1)
      expect(wrapper.findAllComponents(CardPreviewDescription)).toHaveLength(1)
    })

    test('correct props are passed to CardPreviewDescription', () => {
      const wrapper = mount(CardPreview, config)

      const description = wrapper.getComponent(CardPreviewDescription)

      expect(description.props()).toStrictEqual({
        name: singleFacedCard.name,
        manaCost: singleFacedCard?.mana_cost,
        typeLine: singleFacedCard.type_line,
        oracleText: singleFacedCard.oracle_text,
        power: undefined,
        toughness: undefined,
      })
    })

    test('correct props are passed to CardPreviewImage', () => {
      const wrapper = mount(CardPreview, config)

      const image = wrapper.getComponent(CardPreviewImage)

      expect(image.props()).toStrictEqual({
        name: singleFacedCard.name,
        imageUrl: singleFacedCard.image_uris?.large,
      })
    })
  })

  describe('Split face', () => {
    const config = {
      props: {
        cardData: splitFacedCard as CardRaw,
        yPosition: 'top',
      } as any,
      global: {
        stubs: ['Teleport'],
      },
    }

    test('a split card renders one image, and a description for each half', () => {
      const wrapper = mount(CardPreview, config)

      expect(wrapper.findAllComponents(CardPreviewImage)).toHaveLength(1)

      const descriptions = wrapper.findAllComponents(CardPreviewDescription)
      expect(descriptions).toHaveLength(2)
      expect(descriptions[0].props().name).toBe(
        splitFacedCard.card_faces[0].name
      )
      expect(descriptions[1].props().name).toBe(
        splitFacedCard.card_faces[1].name
      )
    })
  })

  describe('Double face', () => {
    const config = {
      props: {
        cardData: doubleFacedCard as CardRaw,
        yPosition: 'top',
      } as any,
      global: {
        stubs: ['Teleport'],
      },
    }

    it('should render two images and one descriptions', () => {
      const wrapper = mount(CardPreview, config)

      expect(wrapper.findAllComponents(CardPreviewImage)).toHaveLength(2)
      expect(wrapper.findAllComponents(CardPreviewDescription)).toHaveLength(2)
    })

    test('correct props are passed to the CardPreviewDescription components', () => {
      const wrapper = mount(CardPreview, config)

      const descriptions = wrapper.findAllComponents(CardPreviewDescription)

      expect(descriptions[0].props()).toStrictEqual({
        name: doubleFacedCard.card_faces[0].name,
        manaCost: doubleFacedCard.card_faces[0]?.mana_cost,
        typeLine: doubleFacedCard.card_faces[0].type_line,
        oracleText: doubleFacedCard.card_faces[0].oracle_text,
        power: undefined,
        toughness: undefined,
      })

      expect(descriptions[1].props()).toStrictEqual({
        name: doubleFacedCard.card_faces[1].name,
        manaCost: doubleFacedCard.card_faces[1]?.mana_cost,
        typeLine: doubleFacedCard.card_faces[1].type_line,
        oracleText: doubleFacedCard.card_faces[1].oracle_text,
        power: doubleFacedCard.card_faces[1].power,
        toughness: doubleFacedCard.card_faces[1].toughness,
      })
    })

    test('correct props are passed to the CardPreviewImage components', () => {
      const wrapper = mount(CardPreview, config)

      const images = wrapper.findAllComponents(CardPreviewImage)

      expect(images[0].props()).toStrictEqual({
        name: doubleFacedCard.card_faces[0].name,
        imageUrl: doubleFacedCard.card_faces[0].image_uris?.large,
      })

      expect(images[1].props()).toStrictEqual({
        name: doubleFacedCard.card_faces[1].name,
        imageUrl: doubleFacedCard.card_faces[1].image_uris?.large,
      })
    })
  })
})
