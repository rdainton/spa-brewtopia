<script lang="ts" setup>
import moment from 'moment'

// Components
import IconButtonConfirmable from '@/components/atoms/IconButtonConfirmable.vue'
import DeleteIcon from '@/components/atoms/icons/DeleteIcon.vue'

interface DecklistListItemProps {
  name: string
  coverImageUrl?: string
  createdAt: string
  updatedAt?: string
}

withDefaults(defineProps<DecklistListItemProps>(), {
  coverImageUrl: '',
  updatedAt: '',
})

defineEmits<{
  (event: 'load'): void
  (event: 'delete'): void
}>()

function formatDate(dateString: string): string {
  return moment(dateString).format('MMMM Do YYYY')
}
</script>

<template>
  <li class="relative hover-trigger">
    <span class="absolute -top-2 right-2">
      <IconButtonConfirmable
        confirmationText="Confirm delete"
        @clicked="$emit('delete')"
      >
        <DeleteIcon />
      </IconButtonConfirmable>
    </span>

    <button
      class="flex items-end w-full bg-gray-100 bg-cover rounded-lg shadow-xl dark:bg-gray-700 h-36"
      :style="{
        backgroundImage: `url(${coverImageUrl})`,
      }"
      @click="$emit('load')"
    >
      <div class="w-full p-2 text-left rounded-b-lg h-15 bg-overlay">
        <h3 class="w-full mb-1 text-white">
          {{ name }}
        </h3>
        <p class="text-xs text-gray-200">
          Last updated: {{ formatDate(updatedAt || createdAt) }}
        </p>
      </div>
    </button>
  </li>
</template>

<style lang="scss">
.hover-trigger {
  span {
    display: none;
  }

  &:hover {
    span {
      display: block;
    }
  }
}
</style>
