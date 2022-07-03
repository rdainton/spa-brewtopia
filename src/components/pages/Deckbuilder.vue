<script lang="ts" setup>
import { ref, computed } from 'vue'
import { v4 as uuid } from 'uuid'
import { parseErrorMap } from '@/apis/brewtopia'

// Imported
import { DecklistSectionName, CardProxy } from '@/types/cards'
import { ControlOptions } from '@/types/deckbuilder'
import { CardRaw } from '@/apis/brewtopia/cards'

// Composables
import useToasts from '@/composables/useToasts'
import useCardActions from '@/composables/useCardActions'
import useCardDrag from '@/composables/useCardDrag'
import useSort from '@/composables/useSort'

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
import DeckbuilderSectionControls from '@/components/molecules/DeckbuilderSectionControls.vue'
import BrewModal from '@/components/atoms/BrewModal.vue'
import CardArtList from '@/components/organisms/CardArtList.vue'
import BlockUI from '@/components/molecules/BlockUI.vue'
import BrewButton from '@/components/molecules/BrewButton.vue'

const UIStore = useUIStore()

/**
 * Deck construction - adding/removing/moving/sorting cards
 */
const decklistStore = useDecklistStore()
decklistStore.init()
const { decklist } = storeToRefs(decklistStore)

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

function handleSearchDragstart(card: CardRaw) {
  // Really we only want to do this once the drop is complete
  cardStore.add(card)

  handleNullOriginDragstart({
    scryId: card.id,
  })
}

function handleSearchDblClick(card: CardRaw) {
  cardStore.add(card)

  const insertable = {
    scryId: card.id,
    uuid: uuid(),
  }
  cardActions.insertAtIndex(decklist.value.mainboard, 0, insertable, -1)
}

/**
 * Change card art
 */
const changingArtForCardId = ref('')

const cardArtModalShowing = computed(() => !!changingArtForCardId.value)

function handleChangeArtForCardId(cardProxy: CardProxy) {
  changingArtForCardId.value = cardProxy.scryId
}

function handleCardArtChange(newCard: CardRaw) {
  cardStore.add(newCard)

  cardActions.changeCardId(
    decklist.value,
    changingArtForCardId.value,
    newCard.id
  )

  changingArtForCardId.value = ''
}

/**
 * Save changes
 */
const dispatch = useToasts()

function saveChanges() {
  decklistStore
    .saveChanges()
    .then(() => {
      dispatch.successToast('Saved successfully.')
    })
    .catch(err => {
      dispatch.errorToast(parseErrorMap(err.response.data))
    })
}
</script>

<template>
  <CardSearch
    @dragstart="handleSearchDragstart"
    @dblclick="handleSearchDblClick"
  />

  <div
    class="relative z-0 flex flex-1 px-4 overflow-x-auto bg-transparent gap-x-2 min-w-[calc(100vw-4rem)] max-w-[calc(100vw-4rem)] styled-scrollbars"
  >
    <DeckbuilderMain>
      <DeckbuilderSection
        title="Main Deck"
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
        @change-art="handleChangeArtForCardId"
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
          @reset="
            decklistStore.clearDecklistSection(DecklistSectionName.MAINBOARD)
          "
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
        @change-art="handleChangeArtForCardId"
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
          @reset="
            decklistStore.clearDecklistSection(DecklistSectionName.SIDEBOARD)
          "
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
        @change-art="handleChangeArtForCardId"
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
          @reset="
            decklistStore.clearDecklistSection(DecklistSectionName.MAYBES)
          "
        />
      </DeckbuilderSection>
    </DeckbuilderSide>
  </div>

  <span
    v-if="decklistStore.unsavedChanges && !decklistStore.loading"
    class="fixed transform translate-x-1/2 right-1/2 bottom-6"
    ><BrewButton size="sm" @click="saveChanges">Save changes</BrewButton></span
  >

  <BrewModal
    size="lg"
    :show="cardArtModalShowing"
    @hide="changingArtForCardId = ''"
  >
    <CardArtList
      :card-id="changingArtForCardId"
      @change="handleCardArtChange"
      @cancel="changingArtForCardId = ''"
    />
  </BrewModal>

  <BlockUI
    v-if="UIStore.loading || decklistStore.loading || cardStore.updating"
  />
</template>
