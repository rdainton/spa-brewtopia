<script lang="ts" setup>
import { reactive } from 'vue'
import { ICard } from '../../types/cards'
import useCardActions from '../../composables/useCardActions'
import useCardDrag from '../../composables/useCardDrag'

// Components
import CardSearch from '../organisms/CardSearch.vue'
import DeckbuilderMain from '../organisms/DeckbuilderMain.vue'
import DeckbuilderSide from '../organisms/DeckbuilderSide.vue'
import DeckbuilderSection from '../organisms/DeckbuilderSection.vue'
// import DeckbuilderCommander from '../organisms/DeckbuilderCommander.vue'

/**
 * Deck state
 */
const mainboard = reactive<ICard[][]>([[], [], [], []])
const maybes = reactive<ICard[][]>([[], []])
const sideboard = reactive<ICard[][]>([[], []])

/**
 * Deck construction - adding/removing/moving cards
 */
const cardActions = useCardActions()

const {
  handleDragstart,
  handleNullOriginDragstart,
  handleDragover,
  handleDrop,
} = useCardDrag(cardActions)

/**
 * Deck filtering
 */

/**
 * Export to .txt
 */
</script>

<template>
  <CardSearch @dragstart="handleNullOriginDragstart" />

  <div
    class="flex flex-1 px-4 overflow-x-auto bg-transparent gap-x-2 min-w-screen"
  >
    <DeckbuilderMain>
      <!-- <DeckbuilderCommander /> -->
      <DeckbuilderSection
        title="Mainboard"
        alignment="left"
        :section-data="mainboard"
        @dragstart="(card, colIdx) => handleDragstart(mainboard, colIdx, card)"
        @dragover="colIdx => handleDragover(mainboard, colIdx)"
        @drop="
          (e, colIdx, forceCardIdx) =>
            handleDrop(e, mainboard, colIdx, forceCardIdx)
        "
        @duplicate="
          (card, colIdx) => cardActions.duplicate(mainboard, colIdx, card)
        "
        @playset="
          (card, colIdx) => cardActions.toPlayset(mainboard, colIdx, card)
        "
        @delete="(card, colIdx) => cardActions.remove(mainboard, colIdx, card)"
      />

      <DeckbuilderSection
        title="Maybes"
        :total-cards-required="Infinity"
        :section-data="maybes"
        @dragstart="(card, colIdx) => handleDragstart(maybes, colIdx, card)"
        @dragover="colIdx => handleDragover(maybes, colIdx)"
        @drop="
          (e, colIdx, forceCardIdx) =>
            handleDrop(e, maybes, colIdx, forceCardIdx)
        "
        @duplicate="
          (card, colIdx) => cardActions.duplicate(maybes, colIdx, card)
        "
        @playset="(card, colIdx) => cardActions.toPlayset(maybes, colIdx, card)"
        @delete="(card, colIdx) => cardActions.remove(maybes, colIdx, card)"
      />
    </DeckbuilderMain>

    <DeckbuilderSide>
      <DeckbuilderSection
        title="Sideboard"
        :total-cards-required="15"
        :section-data="sideboard"
        @dragstart="(card, colIdx) => handleDragstart(sideboard, colIdx, card)"
        @dragover="colIdx => handleDragover(sideboard, colIdx)"
        @drop="
          (e, colIdx, forceCardIdx) =>
            handleDrop(e, sideboard, colIdx, forceCardIdx)
        "
        @duplicate="
          (card, colIdx) => cardActions.duplicate(sideboard, colIdx, card)
        "
        @playset="
          (card, colIdx) => cardActions.toPlayset(sideboard, colIdx, card)
        "
        @delete="(card, colIdx) => cardActions.remove(sideboard, colIdx, card)"
      />
    </DeckbuilderSide>
  </div>
</template>
