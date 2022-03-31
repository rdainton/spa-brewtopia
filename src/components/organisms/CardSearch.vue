<script lang="ts" setup>
import { ref } from 'vue'
import useToasts from '@/composables/useToasts'
import scryfall, { parseErrorMap } from '@/apis/scryfall'
import { ScryfallCard } from '@/apis/scryfall/types'

// Components
import SearchInput from '@/components/molecules/SearchInput.vue'
import SearchResults from '@/components/molecules/SearchResults.vue'

const emit = defineEmits<{
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
</script>
<template>
  <div class="relative">
    <SearchInput @submit="onSearch" />

    <SearchResults
      :searching="searching"
      :results="searchResults"
      @dragstart="card => emit('dragstart', card)"
      @dblclick="card => emit('dblclick', card)"
    />
  </div>
</template>
