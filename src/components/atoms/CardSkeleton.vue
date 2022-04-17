<script lang="ts" setup>
interface CardSkeletonProps {
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<CardSkeletonProps>(), {
  size: 'md',
})

const sizeStylesMap: Record<string, string> = {
  sm: '',
  md: 'w-40 h-56 rounded-md',
  lg: '',
}
</script>

<template>
  <div
    class="flex-shrink-0 bg-gray-200 animate-pulse dark:bg-gray-700"
    :class="[sizeStylesMap[size]]"
  >
    <slot />
  </div>
</template>
