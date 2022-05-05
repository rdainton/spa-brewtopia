import { shallowMount } from '@vue/test-utils'
import CardPreviewDescription from '@/components/atoms/CardPreviewDescription.vue'
import { singleFacedCard } from '../../../testing/fixtures/card'

const requiredProps = {
  name: singleFacedCard.name,
  manaCost: singleFacedCard.mana_cost,
  typeLine: singleFacedCard.type_line,
  oracleText: singleFacedCard.oracle_text,
}

describe('atoms/CardPreviewDescrption.vue', () => {
  it('should render all required props', () => {
    const wrapper = shallowMount(CardPreviewDescription, {
      props: requiredProps,
    })

    expect(wrapper.text()).toContain(requiredProps.name)
    expect(wrapper.text()).toContain(requiredProps.manaCost)
    expect(wrapper.text()).toContain(requiredProps.typeLine)
    expect(wrapper.text()).toContain(requiredProps.oracleText)
  })

  it('should render power and toughness if they are set', () => {
    const wrapper = shallowMount(CardPreviewDescription, {
      props: {
        ...requiredProps,
        power: 'AAA',
        toughness: 'BBB',
      },
    })

    expect(wrapper.text()).toContain('AAA')
    expect(wrapper.text()).toContain('BBB')
  })

  it('should only render power/toughness if they are both set', async () => {
    const wrapper = shallowMount(CardPreviewDescription, {
      props: {
        ...requiredProps,
        power: 'AAA',
      },
    })

    expect(wrapper.text()).not.toContain('AAA')

    await wrapper.setProps({
      power: '',
      toughness: 'BBB',
    })

    expect(wrapper.text()).not.toContain('BBB')
  })
})
