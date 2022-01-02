<script lang="ts" setup>
import { SortKey } from '../../composables/useSort'
import { ControlOptions } from '../../types/deckbuilder'

// Components
import IconButton from '../atoms/IconButton.vue'

// Icons
import SortAscendingIcon from '../atoms/icons/SortAscendingIcon.vue'
import SortDescendingIcon from '../atoms/icons/SortDescendingIcon.vue'
import FlattenIcon from '../atoms/icons/FlattenIcon.vue'
import CardTypeIcon from '../atoms/icons/CardTypeIcon.vue'
import ClearIcon from '../atoms/icons/ClearIcon.vue'

interface DeckbuilderSectionControlsProps {
  options: ControlOptions[]
}

defineProps<DeckbuilderSectionControlsProps>()

const emit = defineEmits<{
  (event: 'sort', sortKey: SortKey, direction?: 'ASC' | 'DESC'): void
  (event: 'flatten'): void
  (event: 'reset'): void
}>()
</script>

<template>
  <div class="flex gap-x-1">
    <IconButton
      v-if="options.includes(ControlOptions.SortManaValueAsc)"
      @click="emit('sort', 'manaValue', 'ASC')"
      size="lg"
      tooltip="Sort by ascending Mana Value"
      :tooltip-below="true"
    >
      <SortAscendingIcon />
    </IconButton>

    <IconButton
      v-if="options.includes(ControlOptions.SortManaValueDesc)"
      @click="emit('sort', 'manaValue', 'DESC')"
      size="lg"
      tooltip="Sort by descending Mana Value"
      :tooltip-below="true"
    >
      <SortDescendingIcon />
    </IconButton>

    <IconButton
      v-if="options.includes(ControlOptions.SortCardType)"
      @click="emit('sort', 'cardType')"
      size="lg"
      tooltip="Sort by card type"
      :tooltip-below="true"
    >
      <CardTypeIcon />
    </IconButton>

    <IconButton
      v-if="options.includes(ControlOptions.Flatten)"
      @click="emit('flatten')"
      size="lg"
      tooltip="Move all cards to one column"
      :tooltip-below="true"
    >
      <FlattenIcon />
    </IconButton>

    <IconButton
      v-if="options.includes(ControlOptions.SortCardType)"
      @click="emit('reset')"
      size="lg"
      tooltip="Reset section"
      :tooltip-below="true"
    >
      <ClearIcon />
    </IconButton>
  </div>
</template>
