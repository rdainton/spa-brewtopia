import { shallowMount } from '@vue/test-utils'
import CardPreviewImage from '@/components/atoms/CardPreviewImage.vue'

describe('atoms/CardPreviewImage.vue', () => {
  it('should render an image if there is an imageUrl', () => {
    const wrapper = shallowMount(CardPreviewImage, {
      props: {
        id: 'AAA',
        name: 'Test',
        imageUrl: 'http://example.com',
      },
    })

    expect(wrapper.find('img').exists()).toBe(true)
  })
})
