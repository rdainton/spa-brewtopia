import { shallowMount } from '@vue/test-utils'
import CardSkeleton from '@/components/atoms/CardSkeleton.vue'

describe('atoms/CardSkeleton.vue', () => {
  it('should render slot content', () => {
    const wrapper = shallowMount(CardSkeleton, {
      slots: {
        default: 'Testing',
      },
    })

    expect(wrapper.text()).toEqual('Testing')
    wrapper.unmount()
  })
})
