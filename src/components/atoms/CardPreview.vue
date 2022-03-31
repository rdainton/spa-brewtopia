<script lang="ts" setup>
import { computed } from 'vue'

// Imported types
import { ScryfallCard } from '@/apis/scryfall/types'
import { StoreableCard } from '@/types/cards'

interface CardPreviewProps {
  cardData: ScryfallCard | StoreableCard
  yPosition: 'top' | 'bottom'
}

const props = defineProps<CardPreviewProps>()

/**
 * Positioning
 */
const yPositionClassMap: Record<string, string> = {
  top: 'top-12',
  bottom: 'top-88',
}

/**
 * Content
 */
const previewImageUrl = computed(() => {
  if (props.cardData.image_uris?.large) return props.cardData.image_uris?.large

  if (props.cardData.card_faces?.length)
    return props.cardData.card_faces[0].image_uris?.normal || ''

  return ''
})

const previewOracleText = computed(() => {
  if (props.cardData.oracle_text) return props.cardData.oracle_text

  if (props.cardData.card_faces?.length)
    return props.cardData.card_faces[0].oracle_text || ''
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed flex bg-gray-100 shadow-md dark:bg-black right-6 rounded-xl"
      :class="[yPositionClassMap[yPosition]]"
    >
      <div
        class="flex flex-col justify-between p-4 w-72 min-h-100 dark:text-white"
      >
        <div class="flex justify-between">
          <h1>
            {{ cardData.name }}
          </h1>

          <div class="flex-shrink-0 mr-2">
            <span>{{ cardData.mana_cost }}</span>
          </div>
        </div>

        <div class="mt-auto">
          <h2 class="mb-1">
            {{ cardData.type_line }}
          </h2>
          <p class="text-sm">
            {{ previewOracleText }}
          </p>
        </div>

        <div class="h-8 text-right">
          <p v-if="cardData.power && cardData.toughness">
            {{ cardData.power }} / {{ cardData.toughness }}
          </p>
        </div>
      </div>

      <div v-if="previewImageUrl" class="w-72">
        <img
          :id="`preview_${cardData.id}`"
          :name="cardData.name"
          :src="previewImageUrl"
          class="w-full max-w-full rounded-xl"
        />
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss"></style>
