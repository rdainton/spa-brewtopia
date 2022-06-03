<script lang="ts" setup>
import { ref, computed } from 'vue'
import useToasts from '@/composables/useToasts'
import brewtopia, { parseErrorMap } from '@/apis/brewtopia'
import { CardRaw } from '@/apis/brewtopia/cards'

// Components
import SearchInput from '@/components/molecules/SearchInput.vue'
import SearchResults from '@/components/molecules/SearchResults.vue'
import IconButton from '@/components/atoms/IconButton.vue'

// Icons
import EyeIcon from '@/components/atoms/icons/EyeIcon.vue'
import EyeOffIcon from '@/components/atoms/icons/EyeOffIcon.vue'

const emit = defineEmits<{
  (event: 'dragstart', card: CardRaw): void
  (event: 'dblclick', card: CardRaw): void
}>()

const dispatch = useToasts()

const searchResults = ref<CardRaw[]>([])
const searching = ref(false)

const onSearch = (searchTerm: string) => {
  if (searching.value) return
  searching.value = true

  brewtopia.cards
    .search(searchTerm)
    .then(res => {
      searchResults.value = res.data?.results
    })
    .catch(err => {
      searchResults.value = []
      dispatch.errorToast(parseErrorMap(err.response.data))
    })
    .finally(() => {
      searching.value = false
    })
}

/**
 * Results visibility
 */
const showResults = ref(false)

const collapsableClasses = computed(() => (showResults.value ? 'h-64' : 'h-2'))
</script>
<template>
  <div
    class="relative duration-500 ease-in-out transition-[height]"
    :class="collapsableClasses"
  >
    <Teleport to="body">
      <div class="fixed items-center hidden top-2 right-20 lg:flex gap-x-2">
        <IconButton
          @clicked="showResults = !showResults"
          size="lg"
          tooltip="Toggle results visibility"
          :tooltip-below="true"
        >
          <EyeIcon v-if="showResults" />
          <EyeOffIcon v-else />
        </IconButton>

        <SearchInput @submit="onSearch" @focus="showResults = true" />
      </div>
    </Teleport>

    <SearchResults
      :searching="searching"
      :results="searchResults"
      @dragstart="card => emit('dragstart', card)"
      @dblclick="card => emit('dblclick', card)"
    />
  </div>
</template>
