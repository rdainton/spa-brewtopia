<script lang="ts" setup>
import { ref } from 'vue'
import scryfall from '../../api/scryfall/search'
import { ICard } from '../../types/cards'
import useToasts from '../../composables/useToasts'
import { parseErrorMap } from '../../api/scryfall'

// Components
import SearchInput from '../molecules/SearchInput.vue'
import SearchResults from '../molecules/SearchResults.vue'

const emit = defineEmits<{
  (event: 'dragstart', card: ICard): void
}>()

const dispatch = useToasts()

const searchResults = ref<ICard[]>([])
const searching = ref(false)

const onSearch = (searchTerm: string) => {
  if (searching.value) return
  searching.value = true

  scryfall
    .search(searchTerm)
    .then(res => {
      searchResults.value = res.data?.data.map(item => ({
        id: item.id,
        name: item.name,
        imgUrl: item.image_uris?.normal || '',
      }))
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
    />
  </div>
</template>
