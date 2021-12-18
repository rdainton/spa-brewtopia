<script lang="ts" setup>
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import SearchIcon from '../atoms/icons/SearchIcon.vue'

const emit = defineEmits<{
  (event: 'submit', searchTerm: string): void
}>()

const MINLEN = 3

const search = ref('')
const prevSearch = ref('')

const initSearch = () => {
  if (search.value.length >= MINLEN) {
    emit('submit', search.value)
    prevSearch.value = search.value
  }
}

const debounceSearch = debounce(function () {
  // check if keyup changed search value (not a meta key, like cmd, alt, etc.)
  if (search.value === prevSearch.value) return

  initSearch()
}, 500)

const clearSearch = () => {
  search.value = ''
}

// reset search state is user clears the search field.
watch(search, (newSearch, prevSearch) => {
  if (prevSearch.length && !newSearch.length) clearSearch()
})
</script>

<template>
  <form
    @submit.prevent="initSearch"
    class="absolute flex items-center w-full gap-2 h-14 md:w-auto -top-12"
  >
    <div class="flex-shrink-0 w-8 h-8 ml-4 text-gray-900 dark:text-white">
      <SearchIcon />
    </div>

    <div class="relative w-full ml-1 border-b border-gray-500 md:w-96">
      <input
        class="w-full py-2 text-2xl placeholder-gray-500 bg-transparent  dark:text-white focus:outline-none"
        v-model="search"
        placeholder="Type to search"
        :minlength="MINLEN"
        type="text"
        @keyup="debounceSearch"
      />
    </div>
  </form>
</template>
