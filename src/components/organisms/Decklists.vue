<script lang="ts" setup>
import config from '@/config'
import { ref } from 'vue'
import brewtopia, { parseErrorMap } from '@/apis/brewtopia'
import { DecklistMeta } from '@/apis/brewtopia/decklists'
import useToasts from '@/composables/useToasts'

// stores
import { useDecklistStore } from '@/stores/useDecklistStore'
import { useUIStore } from '@/stores/useUIStore'

// Components
import DecklistList from '@/components/organisms/DecklistList.vue'
import BrewTitle from '@/components/atoms/BrewTitle.vue'
import BrewText from '@/components/atoms/BrewText.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import PlusIcon from '@/components/atoms/icons/PlusIcon.vue'
import CloseIcon from '@/components/atoms/icons/CloseIcon.vue'

defineEmits<{
  (event: 'cancel'): void
  (event: 'create-new'): void
  (event: 'load', id: number): void
}>()

const maxDecklists = config.maxDecklists
const dispatch = useToasts()
const decklistStore = useDecklistStore()
const UIStore = useUIStore()

const loading = ref(false)
const decklists = ref<DecklistMeta[]>([])

function fetchDecklists() {
  if (loading.value) return

  loading.value = true

  brewtopia.decklists
    .all()
    .then(res => {
      decklists.value = res.data
    })
    .catch(err => {
      dispatch.errorToast(parseErrorMap(err.response.data))
    })
    .finally(() => {
      loading.value = false
    })
}

fetchDecklists()

function deleteDecklist(id: number) {
  UIStore.loading = true

  brewtopia.decklists
    .delete(id)
    .then(() => {
      decklists.value = decklists.value.filter(d => d.id !== id)

      if (id === decklistStore.id) decklistStore.clearDecklist()
    })
    .catch(err => {
      dispatch.errorToast(parseErrorMap(err.response.data))
    })
    .finally(() => {
      UIStore.loading = false
    })
}

function duplicateDecklist(id: number) {
  UIStore.loading = true

  brewtopia.decklists
    .duplicate(id)
    .then(() => {
      fetchDecklists()
    })
    .catch(err => {
      dispatch.errorToast(parseErrorMap(err.response.data))
    })
    .finally(() => {
      UIStore.loading = false
    })
}
</script>

<template>
  <div
    class="flex flex-col p-4 rounded-md shadow-xl bg-gray-50 dark:bg-gray-600 min-h-150"
  >
    <header class="relative flex justify-between mb-8">
      <div>
        <BrewTitle>Your decklists</BrewTitle>
        <BrewText extend-classes="text-sm"
          >Showing {{ decklists.length }} of {{ maxDecklists }}</BrewText
        >
      </div>

      <IconButton size="lg" @click="$emit('cancel')">
        <CloseIcon />
      </IconButton>
    </header>

    <DecklistList
      :loading="loading"
      :decklists="decklists"
      @load="id => $emit('load', id)"
      @delete="deleteDecklist"
      @duplicate="duplicateDecklist"
    >
      <template v-if="decklists.length < maxDecklists" #last-child>
        <button
          class="relative flex items-end w-1/3 bg-white rounded-lg shadow-xl dark:bg-gray-900 h-36 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
          @click="$emit('create-new')"
        >
          <span
            class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          >
            <PlusIcon />
          </span>
        </button>
      </template>
    </DecklistList>
  </div>
</template>
