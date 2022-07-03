<script lang="ts" setup>
import { ref } from 'vue'

// Components
import BrewModal from '@/components/atoms/BrewModal.vue'
import DecklistExportForm from '@/components/organisms/DecklistExportForm.vue'

const modalShowing = ref(false)

function showModal() {
  modalShowing.value = true
}

function hideModal() {
  modalShowing.value = false
}
</script>

<template>
  <slot name="control" :handler="showModal"></slot>

  <BrewModal size="sm" :show="modalShowing" @hide="hideModal">
    <DecklistExportForm @close="hideModal" />
  </BrewModal>
</template>
