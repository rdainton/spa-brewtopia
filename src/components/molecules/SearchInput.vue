<script lang="ts" setup>
import { ref } from 'vue'
import debounce from 'lodash/debounce'
import SearchIcon from '@/components/atoms/icons/SearchIcon.vue'

const emit = defineEmits<{
  (event: 'focus'): void
  (event: 'submit', searchTerm: string): void
}>()

const MINLEN = 3

const search = ref('')
const prevSearch = ref('')

const initSearch = () => {
  prevSearch.value = search.value
  if (search.value.length >= MINLEN) {
    emit('submit', search.value)
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

function handleFocus() {
  emit('focus')
  if (search.value) clearSearch()
}

function handleFocusout() {
  if (!search.value && prevSearch.value.length) {
    search.value = prevSearch.value
  }
}
</script>

<template>
  <form
    @submit.prevent="initSearch"
    class="flex items-center h-12 gap-2 bg-gray-800 rounded-lg lg:w-68 xl:w-auto"
  >
    <div class="w-6 h-6 ml-4 text-white shrink-0">
      <SearchIcon />
    </div>

    <div class="relative w-full ml-1 md:w-80 xl:w-96">
      <input
        class="w-full py-2 text-xl text-white placeholder-gray-500 bg-transparent focus:outline-none"
        v-model="search"
        placeholder="Search for cards..."
        :minlength="MINLEN"
        maxlength="50"
        type="text"
        @keyup="debounceSearch"
        @focus="handleFocus"
        @focusout="handleFocusout"
      />
    </div>
  </form>
</template>
