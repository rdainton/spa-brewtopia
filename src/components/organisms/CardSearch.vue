<script lang="ts" setup>
import { ref, computed } from 'vue'
import useToasts from '@/composables/useToasts'
import scryfall, { parseErrorMap } from '@/apis/scryfall'
import { ScryfallCard } from '@/apis/scryfall/types'

// Components
import SearchInput from '@/components/molecules/SearchInput.vue'
import SearchResults from '@/components/molecules/SearchResults.vue'

interface CardSearchProps {
  hideResults?: boolean
}

const props = withDefaults(defineProps<CardSearchProps>(), {
  hideResults: false,
})

const emit = defineEmits<{
  (event: 'show-results'): void
  (event: 'dragstart', card: ScryfallCard): void
  (event: 'dblclick', card: ScryfallCard): void
}>()

const dispatch = useToasts()

const searchResults = ref<ScryfallCard[]>([])
const searching = ref(false)

const onSearch = (searchTerm: string) => {
  if (searching.value) return
  searching.value = true

  scryfall.search
    .simple(searchTerm)
    .then(res => {
      searchResults.value = res.data?.data
    })
    .catch(err => {
      searchResults.value = []
      // scryfall gives a 404 on cards not found - which shouldn't be an error
      if (err.response.data.status === 404) return

      dispatch.errorToast(parseErrorMap(err.response.data))
    })
    .finally(() => {
      searching.value = false
    })
}

const collapsableClasses = computed(() => (props.hideResults ? 'h-4' : 'h-68'))
</script>
<template>
  <div
    class="relative duration-500 ease-in-out transition-[height]"
    :class="collapsableClasses"
  >
    <Teleport to="body">
      <SearchInput @submit="onSearch" @focus="$emit('show-results')" />
    </Teleport>

    <SearchResults
      :searching="searching"
      :results="searchResults"
      @dragstart="card => emit('dragstart', card)"
      @dblclick="card => emit('dblclick', card)"
    />
  </div>
</template>
