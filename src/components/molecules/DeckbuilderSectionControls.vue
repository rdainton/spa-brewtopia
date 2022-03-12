<script lang="ts" setup>
import { SortKey } from '@/composables/useSort'
import { ControlOptions } from '@/types/deckbuilder'

// Components
import IconButton from '@/components/atoms/IconButton.vue'
import IconButtonConfirmable from '@/components/atoms/IconButtonConfirmable.vue'

// Icons
import SortAscendingIcon from '@/components/atoms/icons/SortAscendingIcon.vue'
import SortDescendingIcon from '@/components/atoms/icons/SortDescendingIcon.vue'
import FlattenIcon from '@/components/atoms/icons/FlattenIcon.vue'
import CardTypeIcon from '@/components/atoms/icons/CardTypeIcon.vue'
import ClearIcon from '@/components/atoms/icons/ClearIcon.vue'

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
      @clicked="emit('sort', 'manaValue', 'ASC')"
      size="lg"
      tooltip="Sort by ascending Mana Value"
      :tooltip-below="true"
    >
      <SortAscendingIcon />
    </IconButton>

    <IconButton
      v-if="options.includes(ControlOptions.SortManaValueDesc)"
      @clicked="emit('sort', 'manaValue', 'DESC')"
      size="lg"
      tooltip="Sort by descending Mana Value"
      :tooltip-below="true"
    >
      <SortDescendingIcon />
    </IconButton>

    <IconButton
      v-if="options.includes(ControlOptions.SortCardType)"
      @clicked="emit('sort', 'cardType')"
      size="lg"
      tooltip="Sort by card type"
      :tooltip-below="true"
    >
      <CardTypeIcon />
    </IconButton>

    <IconButton
      v-if="options.includes(ControlOptions.Flatten)"
      @clicked="emit('flatten')"
      size="lg"
      tooltip="Move all cards to one column"
      :tooltip-below="true"
    >
      <FlattenIcon />
    </IconButton>

    <IconButtonConfirmable
      v-if="options.includes(ControlOptions.Clear)"
      @clicked="emit('reset')"
      size="lg"
      tooltip="Reset section"
      :tooltip-below="true"
    >
      <ClearIcon />
    </IconButtonConfirmable>
  </div>
</template>
