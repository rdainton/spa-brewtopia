<script lang="ts" setup>
import { ref, computed } from 'vue'
import { parseErrorMap } from '@/apis/brewtopia'
import { v4 as uuid } from 'uuid'

// Imported
import { CardSections, ICard } from '@/types/cards'
import { ControlOptions } from '@/types/deckbuilder'
import { ScryfallCard } from '@/apis/scryfall/types'

// Composables
import useCardActions from '@/composables/useCardActions'
import useCardDrag from '@/composables/useCardDrag'
import useExport from '@/composables/useExport'
import useSort from '@/composables/useSort'
import useToasts from '@/composables/useToasts'

// Stores
import { storeToRefs } from 'pinia'
import { useDecklistStore } from '@/stores/useDecklistStore'
import { useCardStore } from '@/stores/useCardStore'
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
import CardArtList from '@/components/organisms/CardArtList.vue'
import DecklistForm from '@/components/organisms/DecklistForm.vue'
import BlockUI from '@/components/molecules/BlockUI.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import ChevronDownIcon from '@/components/atoms/icons/ChevronDownIcon.vue'

const UIStore = useUIStore()

/**
 * Deck construction - adding/removing/moving/sorting cards
 */
const decklistStore = useDecklistStore()
decklistStore.init()
const { decklist, name } = storeToRefs(decklistStore)

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

const cardStore = useCardStore()
const { sort, flatten } = useSort(cardStore.cards, handleDecklistChanges)

function handleSearchDragstart(card: ScryfallCard) {
  // Really we only want to do this once the drop is complete
  cardStore.add(card)

  handleNullOriginDragstart({
    scryId: card.id,
  })
}

function handleSearchDblClick(card: ScryfallCard) {
  cardStore.add(card)

  const insertable = {
    scryId: card.id,
    uuid: uuid(),
  }
  cardActions.insertAtIndex(decklist.value.mainboard, 0, insertable, -1)
}

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
 * Change card art
 */
const changingArtForScryId = ref('')

const cardArtModalShowing = computed(() => !!changingArtForScryId.value)

function handleChangeArtForScryId(iCard: ICard) {
  changingArtForScryId.value = iCard.scryId
}

function handleCardArtChange(newCard: ScryfallCard) {
  cardStore.add(newCard)

  cardActions.changeScryId(
    decklist.value,
    changingArtForScryId.value,
    newCard.id
  )

  changingArtForScryId.value = ''
}

/**
 * Export to .txt
 */
const { exportToTxtFile } = useExport(decklist, name, cardStore.cards)

/**
 * Toggle Deckbuilder expansion
 */
const decklistExpanded = ref(false)
</script>

<template>
  <CardSearch
    :hide-results="decklistExpanded"
    @dragstart="handleSearchDragstart"
    @dblclick="handleSearchDblClick"
    @show-results="decklistExpanded = false"
  />

  <div
    class="relative z-0 flex flex-1 px-4 overflow-x-auto bg-transparent gap-x-2 min-w-screen"
  >
    <span class="absolute z-10 -translate-y-1/2 left-1/2 transfrom">
      <IconButton
        @clicked="decklistExpanded = !decklistExpanded"
        size="lg"
        tooltip="Toggle expansion"
        :tooltip-below="true"
      >
        <ChevronDownIcon
          class="transition-transform duration-500 ease-in-out transform"
          :class="{
            'rotate-180': !decklistExpanded,
          }"
        />
      </IconButton>
    </span>

    <DeckbuilderMain>
      <DeckbuilderSection
        title="Mainboard"
        alignment="left"
        :section-data="decklist.mainboard"
        @dragstart="
          (card, colIdx) => handleDragstart(decklist.mainboard, colIdx, card)
        "
        @dragover="colIdx => handleDragover(decklist.mainboard, colIdx)"
        @drop.prevent="
          (e, colIdx, forceCardIdx) =>
            handleDrop(e, decklist.mainboard, colIdx, forceCardIdx)
        "
        @duplicate="
          (card, colIdx) =>
            cardActions.duplicate(decklist.mainboard, colIdx, card)
        "
        @playset="
          (card, colIdx) =>
            cardActions.toPlayset(decklist.mainboard, colIdx, card)
        "
        @delete="
          (card, colIdx) => cardActions.remove(decklist.mainboard, colIdx, card)
        "
        @change-art="handleChangeArtForScryId"
      >
        <DeckbuilderSectionControls
          :options="[
            ControlOptions.SortManaValueAsc,
            ControlOptions.SortManaValueDesc,
            ControlOptions.SortCardType,
            ControlOptions.Flatten,
            ControlOptions.Clear,
          ]"
          @sort="(...args) => sort(decklist.mainboard, ...args)"
          @flatten="flatten(decklist.mainboard)"
          @reset="decklistStore.clearDecklistSection(CardSections.MAINBOARD)"
        />
      </DeckbuilderSection>
    </DeckbuilderMain>

    <DeckbuilderSide>
      <DeckbuilderSection
        title="Sideboard"
        alignment="left"
        :section-data="decklist.sideboard"
        @dragstart="
          (card, colIdx) => handleDragstart(decklist.sideboard, colIdx, card)
        "
        @dragover="colIdx => handleDragover(decklist.sideboard, colIdx)"
        @drop.prevent="
          (e, colIdx, forceCardIdx) =>
            handleDrop(e, decklist.sideboard, colIdx, forceCardIdx)
        "
        @duplicate="
          (card, colIdx) =>
            cardActions.duplicate(decklist.sideboard, colIdx, card)
        "
        @playset="
          (card, colIdx) =>
            cardActions.toPlayset(decklist.sideboard, colIdx, card)
        "
        @delete="
          (card, colIdx) => cardActions.remove(decklist.sideboard, colIdx, card)
        "
        @change-art="handleChangeArtForScryId"
      >
        <DeckbuilderSectionControls
          :options="[
            ControlOptions.SortManaValueAsc,
            ControlOptions.SortManaValueDesc,
            ControlOptions.SortCardType,
            ControlOptions.Flatten,
            ControlOptions.Clear,
          ]"
          @sort="(...args) => sort(decklist.sideboard, ...args)"
          @flatten="flatten(decklist.sideboard)"
          @reset="decklistStore.clearDecklistSection(CardSections.SIDEBOARD)"
        />
      </DeckbuilderSection>

      <DeckbuilderSection
        title="Maybes"
        :section-data="decklist.maybes"
        @dragstart="
          (card, colIdx) => handleDragstart(decklist.maybes, colIdx, card)
        "
        @dragover="colIdx => handleDragover(decklist.maybes, colIdx)"
        @drop.prevent="
          (e, colIdx, forceCardIdx) =>
            handleDrop(e, decklist.maybes, colIdx, forceCardIdx)
        "
        @duplicate="
          (card, colIdx) => cardActions.duplicate(decklist.maybes, colIdx, card)
        "
        @playset="
          (card, colIdx) => cardActions.toPlayset(decklist.maybes, colIdx, card)
        "
        @delete="
          (card, colIdx) => cardActions.remove(decklist.maybes, colIdx, card)
        "
        @change-art="handleChangeArtForScryId"
      >
        <DeckbuilderSectionControls
          :options="[
            ControlOptions.SortManaValueAsc,
            ControlOptions.SortManaValueDesc,
            ControlOptions.SortCardType,
            ControlOptions.Flatten,
            ControlOptions.Clear,
          ]"
          @sort="(...args) => sort(decklist.maybes, ...args)"
          @flatten="flatten(decklist.maybes)"
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

  <BrewModal
    size="lg"
    :show="cardArtModalShowing"
    @hide="changingArtForScryId = ''"
  >
    <CardArtList
      :card-id="changingArtForScryId"
      @change="handleCardArtChange"
      @cancel="changingArtForScryId = ''"
    />
  </BrewModal>

  <BlockUI
    v-if="UIStore.loading || decklistStore.loading || cardStore.updating"
  />
</template>
