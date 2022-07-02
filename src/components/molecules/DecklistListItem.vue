<script lang="ts" setup>
import moment from 'moment'

// Components
import IconButtonConfirmable from '@/components/atoms/IconButtonConfirmable.vue'
import DeleteIcon from '@/components/atoms/icons/DeleteIcon.vue'
import DuplicateIcon from '@/components/atoms/icons/DuplicateIcon.vue'

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
  (event: 'duplicate'): void
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

    <span class="absolute top-5 right-2">
      <IconButtonConfirmable
        confirmationText="Confirm duplicate"
        @clicked="$emit('duplicate')"
      >
        <DuplicateIcon />
      </IconButtonConfirmable>
    </span>

    <button
      class="flex items-end w-full bg-gray-700 bg-cover rounded-lg shadow-xl h-36"
      :style="{
        backgroundImage: `url(${coverImageUrl})`,
      }"
      @click="$emit('load')"
    >
      <div class="w-full p-2 text-left rounded-b-lg bg-overlay">
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
