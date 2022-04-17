<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import scryfall, { parseErrorMap } from '@/apis/scryfall'
import { ScryfallCard } from '@/apis/scryfall/types'

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

interface CardArtListProps {
  cardId: string
}

const props = withDefaults(defineProps<CardArtListProps>(), {})

defineEmits<{
  (e: 'change', newCard: ScryfallCard): void
  (e: 'cancel'): void
}>()

const dispatch = useToasts()
const cardStore = useCardStore()

const cardName = computed(() => cardStore.cards[props.cardId].name)

const loading = ref(false)
const cardVersions = ref<ScryfallCard[]>([])

function fetchCardVersions() {
  if (loading.value) return

  loading.value = true

  scryfall.search
    .arts(cardName.value)
    .then(res => {
      cardVersions.value = res.data.data.filter(
        // filter out results that aren't the exact name
        result => result.name === cardName.value
      )
    })
    .catch(err => {
      cardVersions.value = []

      // scryfall gives a 404 on cards not found - which shouldn't be an error
      if (err.response.data.status === 404) return

      dispatch.errorToast(parseErrorMap(err.response.data))
    })
    .finally(() => {
      loading.value = false
    })
}

fetchCardVersions()

// handle no results found
const noResults = ref(false)
watch(loading, (_, prev) => {
  noResults.value = prev && !cardVersions.value.length
})
</script>

<template>
  <div
    class="flex flex-col p-4 rounded-md shadow-xl max-h-modal-content bg-gray-50 dark:bg-gray-600 min-h-150"
  >
    <header class="relative flex justify-between mb-4">
      <div>
        <BrewTitle>Change art for "{{ cardName }}"</BrewTitle>
        <BrewText extend-classes="text-sm"
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
        <p class="pt-4 mb-auto text-lg dark:text-white">
          Something went wrong. No arts found.
        </p>
      </template>

      <template v-else>
        <Card
          v-for="card in cardVersions"
          :id="`arts_${card.id}`"
          :key="card.id"
          :data="card"
          :i-card="{
            scryId: card.id,
          }"
          :previewable="false"
          :clickable="true"
          @click="$emit('change', card)"
        />
      </template>
    </div>
  </div>
</template>
