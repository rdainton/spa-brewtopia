<script setup lang="ts">
import { computed, ref } from 'vue'
import { CardProxy } from '@/types/cards'
import useDraggedOver from '@/composables/useDraggedOver'

// Imported types
import { CardRaw } from '@/apis/scryfall/types'
import { CardStoreable } from '@/types/cards'

// Components
import CardPreview from '@/components/atoms/CardPreview.vue'

// Icons
import IconButton from '@/components/atoms/IconButton.vue'
import ImageIcon from '@/components/atoms/icons/ImageIcon.vue'
import PlusIcon from '@/components/atoms/icons/PlusIcon.vue'
import PlaysetIcon from '@/components/atoms/icons/PlaysetIcon.vue'
import EditIcon from '@/components/atoms/icons/EditIcon.vue'

interface CardProps {
  id: string
  data: CardRaw | CardStoreable
  cardProxy: CardProxy
  size?: 'sm' | 'md' | 'lg'
  stacked?: boolean
  withControls?: boolean
  previewable?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<CardProps>(), {
  size: 'md',
  stacked: false,
  withControls: false,
  previewable: true,
  clickable: false,
})

const emit = defineEmits<{
  (event: 'dragstart', card: CardProxy): void
  (event: 'dragend', card: CardProxy): void
  (event: 'duplicate', card: CardProxy): void
  (event: 'playset', card: CardProxy): void
  (event: 'delete', card: CardProxy): void
  (event: 'click', card: CardProxy): void
  (event: 'dblclick', card: CardProxy): void
  (event: 'change-art', card: CardProxy): void
}>()

/**
 * Preview
 */
const showPreview = ref(false)
const previewPosition = ref<
  'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
>('bottom-right')

function setPreviewPosition(e: MouseEvent) {
  const mouse = {
    x: e.clientX,
    y: e.clientY,
  }

  const client = {
    height: window.innerHeight,
    width: window.innerWidth,
  }

  const mouseInTop = client.height / 2 > mouse.y
  const mouseOnLeft = client.width / 2 > mouse.x

  previewPosition.value = `${mouseInTop ? 'bottom' : 'top'}-${
    mouseOnLeft ? 'right' : 'left'
  }`
}

function handleMouseOver(e: MouseEvent) {
  setPreviewPosition(e)
  showPreview.value = true
}

/**
 * Manage drag state
 */
const dragging = ref(false)

function onDragStart() {
  showPreview.value = false
  dragging.value = true
  emit('dragstart', props.cardProxy)
}

function onDragEnds() {
  dragging.value = false
  emit('dragend', props.cardProxy)
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
    :class="[
      { 'opacity-25': dragging },
      { '-mt-49': stacked },
      { 'cursor-pointer': clickable },
      dragStyles,
    ]"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnds"
    @dragenter="handleDragenter"
    @dragleave="handleDragleave"
    @drop.prevent="reset"
    @click="emit('click', cardProxy)"
    @dblclick="emit('dblclick', cardProxy)"
    @contextmenu.prevent="emit('delete', cardProxy)"
    @mouseover="handleMouseOver"
    @mouseleave="showPreview = false"
  >
    <img
      v-if="cardImageUrl"
      :id="cardProxy.uuid ?? ''"
      :name="data.name"
      :src="cardImageUrl"
      class="w-full max-w-full rounded-md"
    />
    <article
      v-else
      :id="cardProxy.uuid ?? ''"
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
      <IconButton
        size="md"
        variant="primary"
        @click="emit('duplicate', cardProxy)"
      >
        <PlusIcon />
      </IconButton>
      <IconButton
        size="md"
        variant="primary"
        @click="emit('playset', cardProxy)"
      >
        <PlaysetIcon />
      </IconButton>
      <IconButton
        size="md"
        variant="secondary"
        @click="emit('change-art', cardProxy)"
      >
        <EditIcon />
      </IconButton>
    </div>
  </div>

  <CardPreview
    v-if="previewable && showPreview"
    :card-data="data"
    :position="previewPosition"
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
