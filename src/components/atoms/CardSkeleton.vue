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
    class="bg-smoke-dark shrink-0 animate-pulse"
    :class="[sizeStylesMap[size]]"
  >
    <slot />
  </div>
</template>
