<script lang="ts" setup>
import { computed } from 'vue'

// Imported types
import { ScryfallCard, CardFace } from '@/apis/scryfall/types'
import { StoreableCard } from '@/types/cards'

// Components
import CardPreviewDescription from '@/components/atoms/CardPreviewDescription.vue'
import CardPreviewImage from '@/components/atoms/CardPreviewImage.vue'

interface CardPreviewProps {
  cardData: ScryfallCard | StoreableCard
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
  () => !!props.cardData?.card_faces && props.cardData.card_faces.length === 2
)

const isSplitFace = computed(
  () =>
    hasTwoFaces.value &&
    props.cardData.card_faces!.reduce(
      (prevBool, face) => face?.image_uris === undefined && prevBool,
      true
    )
)

const cardFrontData = computed(() => {
  let source: CardFace | ScryfallCard | StoreableCard = hasTwoFaces.value
    ? // assert type here as doesn't infer from computed.
      (props.cardData.card_faces as CardFace[])[0]
    : props.cardData

  return {
    name: source.name,
    manaCost: source?.mana_cost,
    typeLine: source.type_line,
    oracleText: source.oracle_text,
    power: source.power,
    toughness: source.toughness,
    imageUrl: isSplitFace.value
      ? props.cardData.image_uris?.large
      : source.image_uris?.large,
  }
})

const cardBackData = computed(() => {
  if (!hasTwoFaces.value) return undefined

  // assert type here as doesn't its defined
  // from hasTwoFaces computed infer from computed.
  const source = (props.cardData.card_faces as CardFace[])[1]

  return {
    name: source.name,
    manaCost: source.mana_cost,
    typeLine: source.type_line,
    oracleText: source.oracle_text,
    power: source.power,
    toughness: source.toughness,
    imageUrl: isSplitFace.value ? '' : source.image_uris?.large,
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed z-10 flex bg-gray-100 shadow-md dark:bg-black rounded-xl"
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
