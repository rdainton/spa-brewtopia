<script lang="ts" setup>
import { watch, ref } from 'vue'
import { ICard } from '../../types/cards'
import Card from '../molecules/Card.vue'
import CardSkeleton from '../atoms/CardSkeleton.vue'

interface SearchResultsProps {
  searching: boolean
  results: ICard[]
}

const props = defineProps<SearchResultsProps>()

const emit = defineEmits<{
  (event: 'dragstart', card: ICard): void
}>()

// handle no results found
const noResults = ref(false)
watch(
  () => props.searching,
  (_, prev) => {
    if (prev && !props.results.length) {
      noResults.value = true
      return
    }
    noResults.value = false
  }
)
</script>

<template>
  <div
    id="search-results"
    class="flex items-center w-full max-w-full p-4 overflow-x-auto bg-white  h-68 dark:bg-gray-900 gap-x-4"
  >
    <template v-if="searching">
      <CardSkeleton v-for="(_, idx) in Array(6)" :key="`skeleton-${idx}`" />
    </template>

    <template v-else-if="noResults">
      <p class="pt-4 mb-auto text-lg dark:text-white">No results found.</p>
    </template>

    <template v-else>
      <Card
        v-for="card in results"
        :id="card.srcyId"
        :key="card.srcyId"
        :data="card"
        @dragstart="emit('dragstart', card)"
      />
    </template>
  </div>
</template>

<style lang="scss">
#search-results {
  // scrollbar?
}
</style>
