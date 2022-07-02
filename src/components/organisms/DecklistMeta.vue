<script lang="ts" setup>
import { ref } from 'vue'

// Stores
import { useDecklistStore } from '@/stores/useDecklistStore'

// Components
import BrewModal from '@/components/atoms/BrewModal.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import DecklistMetaForm from '@/components/organisms/DecklistMetaForm.vue'

// Icons
import EditIcon from '@/components/atoms/icons/EditIcon.vue'
import PlusIcon from '@/components/atoms/icons/PlusIcon.vue'

const decklistStore = useDecklistStore()

const modalShowing = ref(false)

function showModal() {
  modalShowing.value = true
}

function hideModal() {
  modalShowing.value = false
}
</script>

<template>
  <div>
    <h3 class="mt-1 text-xs uppercase text-dark__primary-light">
      Currently brewing
    </h3>
    <h2 v-if="decklistStore.hasName" class="text-xl text-gray-100">
      {{ decklistStore.name }}
      <IconButton @click="showModal">
        <EditIcon />
      </IconButton>
    </h2>

    <h2 v-else class="text-xl text-gray-300">
      Add Deck Name
      <IconButton @click="showModal">
        <PlusIcon />
      </IconButton>
    </h2>
  </div>

  <BrewModal size="sm" :show="modalShowing" @hide="hideModal">
    <DecklistMetaForm @close="hideModal" />
  </BrewModal>
</template>
