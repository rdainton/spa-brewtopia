<script lang="ts" setup>
import { computed } from 'vue'

// Imported types
import { CardRaw, CardFace } from '@/apis/brewtopia/cards'
import { CardStoreable } from '@/types/cards'

// Components
import CardPreviewDescription from '@/components/atoms/CardPreviewDescription.vue'
import CardPreviewImage from '@/components/atoms/CardPreviewImage.vue'

interface CardPreviewProps {
  cardData: CardRaw | CardStoreable
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const props = defineProps<CardPreviewProps>()

/**
 * Positioning
 */
const positionClassMap: Record<string, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
}

/**
 * Content
 */
const hasTwoFaces = computed(
  () => !!props.cardData?.cardFaces && props.cardData.cardFaces.length === 2
)

const isSplitFace = computed(
  () =>
    hasTwoFaces.value &&
    props.cardData.cardFaces!.reduce(
      (prevBool, face) => face?.imgUrl === undefined && prevBool,
      true
    )
)

const cardFrontData = computed(() => {
  let source: CardFace | CardRaw | CardStoreable = hasTwoFaces.value
    ? // assert type here as doesn't infer from computed.
      (props.cardData.cardFaces as CardFace[])[0]
    : props.cardData

  return {
    name: source.name,
    manaCost: source?.manaCost,
    typeLine: source.typeLine,
    oracleText: source.oracleText,
    power: source.power,
    toughness: source.toughness,
    imageUrl: isSplitFace.value
      ? props.cardData.imgUrlLarge
      : source.imgUrlLarge,
  }
})

const cardBackData = computed(() => {
  if (!hasTwoFaces.value) return undefined

  // assert type here as doesn't its defined
  // from hasTwoFaces computed infer from computed.
  const source = (props.cardData.cardFaces as CardFace[])[1]

  return {
    name: source.name,
    manaCost: source.manaCost,
    typeLine: source.typeLine,
    oracleText: source.oracleText,
    power: source.power,
    toughness: source.toughness,
    imageUrl: isSplitFace.value ? '' : source.imgUrlLarge || '',
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed z-10 flex bg-gray-900 shadow-md rounded-xl"
      :class="[positionClassMap[position]]"
    >
      <CardPreviewDescription
        :name="cardFrontData.name"
        :mana-cost="cardFrontData.manaCost"
        :type-line="cardFrontData.typeLine"
        :oracle-text="cardFrontData.oracleText"
        :power="cardFrontData.power"
        :toughness="cardFrontData.toughness"
      />

      <CardPreviewImage
        :name="cardFrontData.name"
        :image-url="cardFrontData.imageUrl"
      />

      <template v-if="cardBackData">
        <CardPreviewImage
          v-if="!isSplitFace"
          :name="cardBackData.name"
          :image-url="cardBackData.imageUrl"
        />
        <CardPreviewDescription
          :name="cardBackData.name"
          :mana-cost="cardBackData.manaCost"
          :type-line="cardBackData.typeLine"
          :oracle-text="cardBackData.oracleText"
          :power="cardBackData.power"
          :toughness="cardBackData.toughness"
        />
      </template>
    </div>
  </Teleport>
</template>
