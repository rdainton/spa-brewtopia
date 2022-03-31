<script setup lang="ts">
import { computed, ref } from 'vue'
import { ICard } from '@/types/cards'
import useDraggedOver from '@/composables/useDraggedOver'

// Imported types
import { ScryfallCard } from '@/apis/scryfall/types'
import { StoreableCard } from '@/types/cards'

// Components
import CardPreview from '@/components/atoms/CardPreview.vue'

// Icons
import IconButton from '@/components/atoms/IconButton.vue'
import ImageIcon from '@/components/atoms/icons/ImageIcon.vue'
import PlusIcon from '@/components/atoms/icons/PlusIcon.vue'
import PlaysetIcon from '@/components/atoms/icons/PlaysetIcon.vue'

interface CardProps {
  id: string
  data: ScryfallCard | StoreableCard
  iCard: ICard
  size?: 'sm' | 'md' | 'lg'
  stacked?: boolean
  withControls?: boolean
}

const props = withDefaults(defineProps<CardProps>(), {
  size: 'md',
  stacked: false,
  withControls: false,
})

const emit = defineEmits<{
  (event: 'dragstart', card: ICard): void
  (event: 'dragend', card: ICard): void
  (event: 'duplicate', card: ICard): void
  (event: 'playset', card: ICard): void
  (event: 'delete', card: ICard): void
  (event: 'dblclick', card: ICard): void
}>()

/**
 * Preview
 */
const showPreview = ref(false)
// controlled cards are not used in search results currently.
const previewPosition = computed(() => (props.withControls ? 'top' : 'bottom'))

/**
 * Manage drag state
 */
const dragging = ref(false)

function onDragStart() {
  showPreview.value = false
  dragging.value = true
  emit('dragstart', props.iCard)
}

function onDragEnds() {
  dragging.value = false
  emit('dragend', props.iCard)
}

/**
 * Manage draggedOver state, and its impact on styling
 */
const { draggedOver, handleDragenter, handleDragleave, reset } =
  useDraggedOver()

const dragStyles = computed(() => {
  const baseDragStyles = 'transform ease-out transition-transform'
  return `${baseDragStyles} ${
    draggedOver.value ? 'translate-y-0' : 'translate-y-2'
  }`
})

/**
 * Presentation helpers.
 */
const cardImageUrl = computed(() => {
  if (props.data.image_uris?.normal) return props.data.image_uris?.normal

  if (props.data.card_faces?.length)
    return props.data.card_faces[0].image_uris?.normal || ''

  return ''
})
</script>

<template>
  <div
    class="relative flex flex-shrink-0 w-40 h-56 bg-black rounded-md trigger card"
    :class="[{ 'opacity-25': dragging }, { '-mt-49': stacked }, dragStyles]"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnds"
    @dragenter="handleDragenter"
    @dragleave="handleDragleave"
    @drop.prevent="reset"
    @dblclick="emit('dblclick', iCard)"
    @contextmenu.prevent="emit('delete', iCard)"
    @mouseover="showPreview = true"
    @mouseleave="showPreview = false"
  >
    <img
      v-if="cardImageUrl"
      :id="iCard.uuid ?? ''"
      :name="data.name"
      :src="cardImageUrl"
      class="w-full max-w-full rounded-md"
    />
    <article
      v-else
      :id="iCard.uuid ?? ''"
      class="relative flex items-center justify-center flex-1 rounded-md"
    >
      <p class="absolute w-10/12 text-xs text-white break-words top-2 left-2">
        {{ data.name }}
      </p>

      <div class="w-32 h-32 dark:text-gray-900">
        <ImageIcon />
      </div>
    </article>

    <div v-if="withControls" class="absolute left-0 flex -top-2 gap-x-1">
      <IconButton size="md" variant="primary" @click="emit('duplicate', iCard)">
        <PlusIcon />
      </IconButton>
      <IconButton size="md" variant="primary" @click="emit('playset', iCard)">
        <PlaysetIcon />
      </IconButton>
    </div>
  </div>

  <CardPreview
    v-if="showPreview"
    :card-data="data"
    :y-position="previewPosition"
  />
</template>

<style lang="scss">
.trigger {
  & > div {
    display: none;
  }

  &:hover {
    & > div {
      display: block;
    }
  }
}
</style>
