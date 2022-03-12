<script lang="ts" setup>
import { DecklistMeta } from '@/apis/brewtopia/decklists'

// Components
import ListItem from '@/components/molecules/DecklistListItem.vue'
import ListItemSkeleton from '@/components/atoms/DecklistListItemSkeleton.vue'

interface DecklistListProps {
  loading: boolean
  decklists: DecklistMeta[]
}

withDefaults(defineProps<DecklistListProps>(), {})

defineEmits<{
  (event: 'load', id: number): void
  (event: 'delete', id: number): void
}>()

const listClasses = 'w-full gap-4 grid grid-cols-4'
</script>

<template>
  <ul v-if="loading" :class="listClasses">
    <ListItemSkeleton v-for="i in Array(5)" :key="i" />
  </ul>

  <ul v-else :class="listClasses">
    <ListItem
      v-for="decklist in decklists"
      :key="decklist.id"
      :name="decklist.name"
      :created-at="decklist.createdAt"
      :updated-at="decklist.updatedAt"
      :cover-image-url="decklist.coverImageUrl"
      @load="$emit('load', decklist.id)"
      @delete="$emit('delete', decklist.id)"
    />

    <slot name="last-child" />
  </ul>
</template>
