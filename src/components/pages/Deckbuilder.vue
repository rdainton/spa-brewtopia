<script lang="ts" setup>
import { ref } from 'vue'
import { parseErrorMap } from '@/apis/brewtopia'

// Imported
import { CardSections } from '@/types/cards'
import { ControlOptions } from '@/types/deckbuilder'

// Composables
import useCardActions from '@/composables/useCardActions'
import useCardDrag from '@/composables/useCardDrag'
import useExport from '@/composables/useExport'
import useSort from '@/composables/useSort'
import useToasts from '@/composables/useToasts'

// Stores
import { useDecklistStore } from '@/stores/useDecklistStore'
import { useUIStore } from '@/stores/useUIStore'

// Components
import CardSearch from '@/components/organisms/CardSearch.vue'
import DeckbuilderMain from '@/components/organisms/DeckbuilderMain.vue'
import DeckbuilderSide from '@/components/organisms/DeckbuilderSide.vue'
import DeckbuilderSection from '@/components/organisms/DeckbuilderSection.vue'
import DeckbuilderDock from '@/components/molecules/DeckbuilderDock.vue'
import DeckbuilderSectionControls from '@/components/molecules/DeckbuilderSectionControls.vue'
import BrewModal from '@/components/atoms/BrewModal.vue'
import Decklists from '@/components/organisms/Decklists.vue'
import DecklistForm from '@/components/organisms/DecklistForm.vue'
import BlockUI from '@/components/molecules/BlockUI.vue'

const UIStore = useUIStore()

/**
 * Deck construction - adding/removing/moving/sorting cards
 */
const decklistStore = useDecklistStore()
decklistStore.init()

function handleDecklistChanges() {
  decklistStore.unsavedChanges = true
  decklistStore.persistToLocalStorage()
}

const cardActions = useCardActions(handleDecklistChanges)

const {
  handleDragstart,
  handleNullOriginDragstart,
  handleDragover,
  handleDrop,
} = useCardDrag(cardActions)

const { sort, flatten } = useSort(handleDecklistChanges)

/**
 * Save/load decklists
 */
const dispatch = useToasts()

const decklistsModalShowing = ref(false)

function newDecklist() {
  decklistsModalShowing.value = false

  decklistStore.clearDecklist()
}

function loadDecklist(id: number) {
  decklistsModalShowing.value = false

  decklistStore.get(id).catch(err => {
    dispatch.errorToast(parseErrorMap(err.response.data))
  })
}

function saveDecklist(newName: string) {
  decklistStore.name = newName

  decklistStore
    .saveChanges()
    .then(() => {
      dispatch.successToast('Saved successfully.')
    })
    .catch(err => {
      dispatch.errorToast(parseErrorMap(err.response.data))
    })
}

function viewDecklists() {
  decklistsModalShowing.value = true
}

/**
 * Export to .txt
 */
const { exportToTxtFile } = useExport(decklistStore.decklist)
</script>

<template>
  <CardSearch @dragstart="handleNullOriginDragstart" />

  <div
    class="flex flex-1 px-4 overflow-x-auto bg-transparent gap-x-2 min-w-screen"
  >
    <DeckbuilderMain>
      <DeckbuilderSection
        title="Mainboard"
        alignment="left"
        :section-data="decklistStore.decklist.mainboard"
        @dragstart="
          (card, colIdx) =>
            handleDragstart(decklistStore.decklist.mainboard, colIdx, card)
        "
        @dragover="
          colIdx => handleDragover(decklistStore.decklist.mainboard, colIdx)
        "
        @drop="
          (e, colIdx, forceCardIdx) =>
            handleDrop(
              e,
              decklistStore.decklist.mainboard,
              colIdx,
              forceCardIdx
            )
        "
        @duplicate="
          (card, colIdx) =>
            cardActions.duplicate(
              decklistStore.decklist.mainboard,
              colIdx,
              card
            )
        "
        @playset="
          (card, colIdx) =>
            cardActions.toPlayset(
              decklistStore.decklist.mainboard,
              colIdx,
              card
            )
        "
        @delete="
          (card, colIdx) =>
            cardActions.remove(decklistStore.decklist.mainboard, colIdx, card)
        "
      >
        <DeckbuilderSectionControls
          :options="[
            ControlOptions.SortManaValueAsc,
            ControlOptions.SortManaValueDesc,
            ControlOptions.SortCardType,
            ControlOptions.Flatten,
            ControlOptions.Clear,
          ]"
          @sort="(...args) => sort(decklistStore.decklist.mainboard, ...args)"
          @flatten="flatten(decklistStore.decklist.mainboard)"
          @reset="decklistStore.clearDecklistSection(CardSections.MAINBOARD)"
        />
      </DeckbuilderSection>
    </DeckbuilderMain>

    <DeckbuilderSide>
      <DeckbuilderSection
        title="Sideboard"
        alignment="left"
        :total-cards-required="15"
        :section-data="decklistStore.decklist.sideboard"
        @dragstart="
          (card, colIdx) =>
            handleDragstart(decklistStore.decklist.sideboard, colIdx, card)
        "
        @dragover="
          colIdx => handleDragover(decklistStore.decklist.sideboard, colIdx)
        "
        @drop="
          (e, colIdx, forceCardIdx) =>
            handleDrop(
              e,
              decklistStore.decklist.sideboard,
              colIdx,
              forceCardIdx
            )
        "
        @duplicate="
          (card, colIdx) =>
            cardActions.duplicate(
              decklistStore.decklist.sideboard,
              colIdx,
              card
            )
        "
        @playset="
          (card, colIdx) =>
            cardActions.toPlayset(
              decklistStore.decklist.sideboard,
              colIdx,
              card
            )
        "
        @delete="
          (card, colIdx) =>
            cardActions.remove(decklistStore.decklist.sideboard, colIdx, card)
        "
      >
        <DeckbuilderSectionControls
          :options="[
            ControlOptions.SortManaValueAsc,
            ControlOptions.SortManaValueDesc,
            ControlOptions.SortCardType,
            ControlOptions.Flatten,
            ControlOptions.Clear,
          ]"
          @sort="(...args) => sort(decklistStore.decklist.sideboard, ...args)"
          @flatten="flatten(decklistStore.decklist.sideboard)"
          @reset="decklistStore.clearDecklistSection(CardSections.SIDEBOARD)"
        />
      </DeckbuilderSection>

      <DeckbuilderSection
        title="Maybes"
        :total-cards-required="Infinity"
        :section-data="decklistStore.decklist.maybes"
        @dragstart="
          (card, colIdx) =>
            handleDragstart(decklistStore.decklist.maybes, colIdx, card)
        "
        @dragover="
          colIdx => handleDragover(decklistStore.decklist.maybes, colIdx)
        "
        @drop="
          (e, colIdx, forceCardIdx) =>
            handleDrop(e, decklistStore.decklist.maybes, colIdx, forceCardIdx)
        "
        @duplicate="
          (card, colIdx) =>
            cardActions.duplicate(decklistStore.decklist.maybes, colIdx, card)
        "
        @playset="
          (card, colIdx) =>
            cardActions.toPlayset(decklistStore.decklist.maybes, colIdx, card)
        "
        @delete="
          (card, colIdx) =>
            cardActions.remove(decklistStore.decklist.maybes, colIdx, card)
        "
      >
        <DeckbuilderSectionControls
          :options="[
            ControlOptions.SortManaValueAsc,
            ControlOptions.SortManaValueDesc,
            ControlOptions.SortCardType,
            ControlOptions.Flatten,
            ControlOptions.Clear,
          ]"
          @sort="(...args) => sort(decklistStore.decklist.maybes, ...args)"
          @flatten="flatten(decklistStore.decklist.maybes)"
          @reset="decklistStore.clearDecklistSection(CardSections.MAYBES)"
        />
      </DeckbuilderSection>
    </DeckbuilderSide>
  </div>

  <DeckbuilderDock @view="viewDecklists" @export="exportToTxtFile">
    <DecklistForm @updated="saveDecklist" />
  </DeckbuilderDock>

  <BrewModal
    size="lg"
    :show="decklistsModalShowing"
    @hide="decklistsModalShowing = false"
  >
    <Decklists
      @load="loadDecklist"
      @create-new="newDecklist"
      @cancel="decklistsModalShowing = false"
    />
  </BrewModal>

  <BlockUI v-if="UIStore.loading || decklistStore.loading" />
</template>
