<script lang="ts" setup>
// Components
import BrewButton from '@/components/molecules/BrewButton.vue'
import BrewLoading from '@/components/atoms/BrewLoading.vue'

interface BrewPaginatorProps {
  paginatable: boolean
  paginating: boolean
}

defineProps<BrewPaginatorProps>()

defineEmits<{
  (e: 'paginate'): void
}>()
</script>

<template>
  <div v-if="paginatable" class="flex justify-center w-full py-3">
    <div v-if="paginating" class="py-1">
      <BrewLoading />
    </div>

    <BrewButton v-else @click="$emit('paginate')" size="md">
      Load more
    </BrewButton>
  </div>
</template>
