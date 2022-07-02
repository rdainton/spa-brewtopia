<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import brewtopia, { parseErrorMap } from '@/apis/brewtopia'
import { CardRaw } from '@/apis/brewtopia/cards'

// Composables
import useToasts from '@/composables/useToasts'

// Stores
import { useCardStore } from '@/stores/useCardStore'

// Components
import BrewTitle from '@/components/atoms/BrewTitle.vue'
import CloseIcon from '@/components/atoms/icons/CloseIcon.vue'
import BrewText from '@/components/atoms/BrewText.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import Card from '@/components/molecules/Card.vue'
import CardSkeleton from '@/components/atoms/CardSkeleton.vue'
import BrewPaginator from '@/components/molecules/BrewPaginator.vue'

interface CardArtListProps {
  cardId: string
}

const props = withDefaults(defineProps<CardArtListProps>(), {})

defineEmits<{
  (e: 'change', newCard: CardRaw): void
  (e: 'cancel'): void
}>()

const dispatch = useToasts()
const cardStore = useCardStore()

const cardName = computed(() => cardStore.cards[props.cardId].name)

const loading = ref(false)
const cardVersions = ref<CardRaw[]>([])
const paginatable = ref(false)
const paginating = ref(false)
const nextPage = ref(1)

function fetchCardVersions() {
  if (loading.value) return

  loading.value = true

  brewtopia.cards
    .arts(cardName.value)
    .then(res => {
      cardVersions.value = res.data.results
      paginatable.value = res.data.hasMore
      nextPage.value = 2
    })
    .catch(err => {
      cardVersions.value = []
      dispatch.errorToast(parseErrorMap(err.response.data))
    })
    .finally(() => {
      loading.value = false
    })
}

fetchCardVersions()

function handlePaginate() {
  if (loading.value || paginating.value) return

  paginating.value = true

  brewtopia.cards
    .arts(cardName.value, nextPage.value)
    .then(res => {
      cardVersions.value = [...cardVersions.value, ...res.data.results]
      paginatable.value = res.data.hasMore
      nextPage.value = nextPage.value + 1
    })
    .catch(err => {
      dispatch.errorToast(parseErrorMap(err.response.data))
    })
    .finally(() => {
      paginating.value = false
    })
}

// handle no results found
const noResults = ref(false)
watch(loading, (_, prev) => {
  noResults.value = prev && !cardVersions.value.length
})
</script>

<template>
  <div
    class="flex flex-col p-4 rounded-md shadow-inner bg-smoke-medium max-h-modal-content min-h-150 shadow-pink-light/100"
  >
    <header class="relative flex justify-between mb-4">
      <div>
        <BrewTitle>Change art for "{{ cardName }}"</BrewTitle>
        <BrewText extend-classes="text-sm mt-2"
          >Selecting a new card art will change all copies in your
          decklist.</BrewText
        >
      </div>

      <IconButton size="lg" @click="$emit('cancel')">
        <CloseIcon />
      </IconButton>
    </header>

    <div
      class="flex flex-wrap justify-center flex-1 w-full h-full gap-3 overflow-y-auto"
    >
      <template v-if="loading">
        <CardSkeleton v-for="(_, idx) in Array(6)" :key="`skeleton-${idx}`" />
      </template>

      <template v-else-if="noResults">
        <p class="pt-4 mb-auto text-lg text-white">
          Something went wrong. No arts found.
        </p>
      </template>

      <template v-else>
        <Card
          v-for="card in cardVersions"
          :id="`arts_${card.id}`"
          :key="card.id"
          :data="card"
          :card-proxy="{
            scryId: card.id,
          }"
          :previewable="false"
          :clickable="true"
          @click="$emit('change', card)"
        />
        <BrewPaginator
          :paginatable="paginatable"
          :paginating="paginating"
          @paginate="handlePaginate"
        />
      </template>
    </div>
  </div>
</template>
