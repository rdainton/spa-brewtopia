<script lang="ts" setup>
import { parseErrorMap } from '@/apis/brewtopia'

// Composables
import useToasts from '@/composables/useToasts'

// Store
import { useDecklistStore } from '@/stores/useDecklistStore'

// Components
import DecklistForm from '@/components/organisms/DecklistForm.vue'

/**
 * Save decklists
 */
const decklistStore = useDecklistStore()
const dispatch = useToasts()

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

// TODO: this component will likely change
// completely in the next feature addition
</script>

<template>
  <div class="flex items-center bg-transparent">
    <DecklistForm @updated="saveDecklist" />
  </div>
</template>
