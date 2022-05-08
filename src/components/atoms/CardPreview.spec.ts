import { mount } from '@vue/test-utils'

// Types
import { CardRaw } from '@/apis/brewtopia/cards'

// Fixtures
import {
  singleFacedCard,
  doubleFacedCard,
  splitFacedCard,
} from '../../../testing/fixtures/card'

// Components
import CardPreview from '@/components/atoms/CardPreview.vue'
import CardPreviewImage from '@/components/atoms/CardPreviewImage.vue'
import CardPreviewDescription from '@/components/atoms/CardPreviewDescription.vue'

describe('atoms/CardPreview.vue', () => {
  describe('Single face', () => {
    const config = {
      props: {
        cardData: singleFacedCard as CardRaw,
        position: 'top-right',
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
        manaCost: singleFacedCard?.manaCost,
        typeLine: singleFacedCard.typeLine,
        oracleText: singleFacedCard.oracleText,
        power: undefined,
        toughness: undefined,
      })
    })

    test('correct props are passed to CardPreviewImage', () => {
      const wrapper = mount(CardPreview, config)

      const image = wrapper.getComponent(CardPreviewImage)

      expect(image.props()).toStrictEqual({
        name: singleFacedCard.name,
        imageUrl: singleFacedCard.imgUrlLarge,
      })
    })
  })

  describe('Split face', () => {
    const config = {
      props: {
        cardData: splitFacedCard as CardRaw,
        position: 'top-right',
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
        splitFacedCard.cardFaces[0].name
      )
      expect(descriptions[1].props().name).toBe(
        splitFacedCard.cardFaces[1].name
      )
    })
  })

  describe('Double face', () => {
    const config = {
      props: {
        cardData: doubleFacedCard as CardRaw,
        position: 'top-right',
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
        name: doubleFacedCard.cardFaces[0].name,
        manaCost: doubleFacedCard.cardFaces[0]?.manaCost,
        typeLine: doubleFacedCard.cardFaces[0].typeLine,
        oracleText: doubleFacedCard.cardFaces[0].oracleText,
        power: undefined,
        toughness: undefined,
      })

      expect(descriptions[1].props()).toStrictEqual({
        name: doubleFacedCard.cardFaces[1].name,
        manaCost: doubleFacedCard.cardFaces[1]?.manaCost,
        typeLine: doubleFacedCard.cardFaces[1].typeLine,
        oracleText: doubleFacedCard.cardFaces[1].oracleText,
        power: doubleFacedCard.cardFaces[1].power,
        toughness: doubleFacedCard.cardFaces[1].toughness,
      })
    })

    test('correct props are passed to the CardPreviewImage components', () => {
      const wrapper = mount(CardPreview, config)

      const images = wrapper.findAllComponents(CardPreviewImage)

      expect(images[0].props()).toStrictEqual({
        name: doubleFacedCard.cardFaces[0].name,
        imageUrl: doubleFacedCard.cardFaces[0].imgUrlLarge,
      })

      expect(images[1].props()).toStrictEqual({
        name: doubleFacedCard.cardFaces[1].name,
        imageUrl: doubleFacedCard.cardFaces[1].imgUrlLarge,
      })
    })
  })
})
