<script setup lang="ts">
import { ref } from 'vue'
import { ICard } from '../../types/cards'
import IconButton from '../atoms/IconButton.vue'
import ImageIcon from '../atoms/icons/ImageIcon.vue'
import PlusIcon from '../atoms/icons/PlusIcon.vue'
import PlaysetIcon from '../atoms/icons/PlaysetIcon.vue'

interface CardProps {
  id: string
  data: ICard
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
}>()

const dragging = ref(false)

function onDragStart() {
  dragging.value = true
  emit('dragstart', props.data)
}

function onDragEnds() {
  dragging.value = false
  emit('dragend', props.data)
}
</script>

<template>
  <div
    class="relative flex flex-shrink-0 w-40 h-56 bg-black rounded-md  trigger card"
    :class="[{ 'opacity-25': dragging }, { '-mt-48': stacked }]"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnds"
    @contextmenu.prevent="emit('delete', data)"
  >
    <img
      v-if="data.imgUrl"
      :id="data.uuid ?? ''"
      :name="data.name"
      :src="data.imgUrl"
      class="w-full max-w-full rounded-md"
    />
    <article
      v-else
      :id="data.uuid ?? ''"
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
      <IconButton size="md" variant="primary" @click="emit('duplicate', data)">
        <PlusIcon />
      </IconButton>
      <IconButton size="md" variant="primary" @click="emit('playset', data)">
        <PlaysetIcon />
      </IconButton>
    </div>
  </div>
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
