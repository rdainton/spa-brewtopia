<script lang="ts" setup>
interface CardPreviewImageProps {
  name: string
  imageUrl?: string
}

defineProps<CardPreviewImageProps>()
</script>

<template>
  <div v-if="imageUrl" class="w-60 xl:w-72">
    <img :name="name" :src="imageUrl" class="w-full max-w-full rounded-xl" />
  </div>
</template>
