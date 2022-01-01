<script lang="ts" setup>
import { reactive } from 'vue'
import { CardSection } from '../../types/cards'
import { ControlOptions } from '../../types/deckbuilder'
import useCardActions from '../../composables/useCardActions'
import useCardDrag from '../../composables/useCardDrag'
import useExport from '../../composables/useExport'
import useLocalStorage from '../../composables/useLocalStorage'
import useSort from '../../composables/useSort'

// Components
import CardSearch from '../organisms/CardSearch.vue'
import DeckbuilderMain from '../organisms/DeckbuilderMain.vue'
import DeckbuilderSide from '../organisms/DeckbuilderSide.vue'
import DeckbuilderSection from '../organisms/DeckbuilderSection.vue'
import DeckbuilderDock from '../molecules/DeckbuilderDock.vue'
import DeckbuilderSectionControls from '../molecules/DeckbuilderSectionControls.vue'
// import DeckbuilderCommander from '../organisms/DeckbuilderCommander.vue'

const defaultColumns = {
  mainboard: [[], [], [], [], []],
  sideboard: [[], []],
  maybes: [[], []],
}

/**
 * Deck state.
 */
const mainboard = reactive<CardSection>([...defaultColumns.mainboard])
const sideboard = reactive<CardSection>([...defaultColumns.sideboard])
const maybes = reactive<CardSection>([...defaultColumns.maybes])

/**
 * Decklist helpers, featuring Local Storage.
 */
const { load, store, clear } = useLocalStorage<{
  mainboard: CardSection
  maybes: CardSection
  sideboard: CardSection
}>('decklist')

function resetDecklist() {
  mainboard.splice(0, mainboard.length, ...defaultColumns.mainboard)
  sideboard.splice(0, sideboard.length, ...defaultColumns.sideboard)
  maybes.splice(0, maybes.length, ...defaultColumns.maybes)

  clear()
}

function persistToLocalStorage() {
  store({
    mainboard,
    maybes,
    sideboard,
  })
}

function resetSection(section: CardSection, columns: CardSection) {
  section.splice(0, section.length, ...columns)
  persistToLocalStorage()
}

/**
 * Load decklist from Local Storage on load.
 */
const storedDecklist = load()
if (storedDecklist) {
  mainboard.splice(0, mainboard.length, ...storedDecklist.mainboard)
  maybes.splice(0, maybes.length, ...storedDecklist.maybes)
  sideboard.splice(0, sideboard.length, ...storedDecklist.sideboard)
}

/**
 * Deck construction - adding/removing/moving cards
 */
const cardActions = useCardActions(persistToLocalStorage)

const {
  handleDragstart,
  handleNullOriginDragstart,
  handleDragover,
  handleDrop,
} = useCardDrag(cardActions)

/**
 * Deck sorting
 */
const { sort, flatten } = useSort(persistToLocalStorage)

/**
 * Export to .txt
 */
const { exportToTxtFile } = useExport(mainboard, maybes, sideboard)
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
      >
        <DeckbuilderSectionControls
          :options="[
            ControlOptions.SortManaValueAsc,
            ControlOptions.SortManaValueDesc,
            ControlOptions.SortCardType,
            ControlOptions.Flatten,
            ControlOptions.Clear,
          ]"
          @sort="(...args) => sort(mainboard, ...args)"
          @flatten="flatten(mainboard)"
          @reset="resetSection(mainboard, defaultColumns.mainboard)"
        />
      </DeckbuilderSection>
    </DeckbuilderMain>

    <DeckbuilderSide>
      <DeckbuilderSection
        title="Sideboard"
        alignment="left"
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
      >
        <DeckbuilderSectionControls
          :options="[
            ControlOptions.SortManaValueAsc,
            ControlOptions.SortManaValueDesc,
            ControlOptions.SortCardType,
            ControlOptions.Flatten,
            ControlOptions.Clear,
          ]"
          @sort="(...args) => sort(sideboard, ...args)"
          @flatten="flatten(sideboard)"
          @reset="resetSection(sideboard, defaultColumns.sideboard)"
        />
      </DeckbuilderSection>

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
      >
        <DeckbuilderSectionControls
          :options="[
            ControlOptions.SortManaValueAsc,
            ControlOptions.SortManaValueDesc,
            ControlOptions.SortCardType,
            ControlOptions.Flatten,
            ControlOptions.Clear,
          ]"
          @sort="(...args) => sort(maybes, ...args)"
          @flatten="flatten(maybes)"
          @reset="resetSection(maybes, defaultColumns.maybes)"
        />
      </DeckbuilderSection>
    </DeckbuilderSide>
  </div>

  <DeckbuilderDock @export="exportToTxtFile" @reset="resetDecklist" />
</template>
