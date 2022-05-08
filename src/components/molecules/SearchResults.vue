<script lang="ts" setup>
import { watch, ref } from 'vue'
import { CardRaw } from '@/apis/brewtopia/cards'

// Components
import Card from '@/components/molecules/Card.vue'
import CardSkeleton from '@/components/atoms/CardSkeleton.vue'

interface SearchResultsProps {
  searching: boolean
  results: CardRaw[]
}

const props = defineProps<SearchResultsProps>()

const emit = defineEmits<{
  (event: 'dragstart', card: CardRaw): void
  (event: 'dblclick', card: CardRaw): void
}>()

// handle no results found
const noResults = ref(false)
watch(
  () => props.searching,
  (_, prev) => {
    noResults.value = prev && !props.results.length
  }
)
</script>

<template>
  <div
    id="search-results"
    class="flex w-full max-w-full p-4 overflow-x-auto bg-white h-68 dark:bg-gray-900 gap-x-4"
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
        :id="`search_${card.id}`"
        :key="card.id"
        :data="card"
        :card-proxy="{
          scryId: card.id,
        }"
        @dragstart="emit('dragstart', card)"
        @dblclick="emit('dblclick', card)"
      />
    </template>
  </div>
</template>

<style lang="scss">
#search-results {
  // scrollbar?
}
</style>
