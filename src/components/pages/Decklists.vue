<script lang="ts" setup>
import config from '@/config'
import { ref } from 'vue'
import brewtopia, { parseErrorMap } from '@/apis/brewtopia'
import { DecklistMeta } from '@/apis/brewtopia/decklists'

// Composables
import useToasts from '@/composables/useToasts'
import { useRouter } from 'vue-router'

// stores
import { useDecklistStore } from '@/stores/useDecklistStore'
import { useUIStore } from '@/stores/useUIStore'

// Components
import BrewLayout from '@/components/layouts/BrewLayout.vue'
import DecklistList from '@/components/organisms/DecklistList.vue'
import BrewTitle from '@/components/atoms/BrewTitle.vue'
import BrewText from '@/components/atoms/BrewText.vue'
import PlusIcon from '@/components/atoms/icons/PlusIcon.vue'

const maxDecklists = config.maxDecklists
const dispatch = useToasts()
const router = useRouter()
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

function pushToDeckbuilder() {
  router.push({ name: 'deckbuilder' })
}

function newDecklist() {
  decklistStore.clearDecklist()

  pushToDeckbuilder()
}

function loadDecklist(id: number) {
  decklistStore.get(id).catch(err => {
    dispatch.errorToast(parseErrorMap(err.response.data))
  })

  pushToDeckbuilder()
}
</script>

<template>
  <BrewLayout>
    <div class="flex flex-col">
      <header class="relative flex justify-between mb-8">
        <div>
          <BrewTitle>Your decklists</BrewTitle>
          <BrewText extend-classes="text-sm"
            >Showing {{ decklists.length }} of {{ maxDecklists }}</BrewText
          >
        </div>
      </header>

      <DecklistList
        :loading="loading"
        :decklists="decklists"
        @load="loadDecklist"
        @delete="deleteDecklist"
        @duplicate="duplicateDecklist"
      >
        <template v-if="decklists.length < maxDecklists" #last-child>
          <button
            class="relative flex items-end w-1/3 bg-gray-100 rounded-lg shadow-xl dark:bg-gray-700 h-36 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
            @click="newDecklist"
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
  </BrewLayout>
</template>
