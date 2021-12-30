<script lang="ts" setup>
interface TooltipProps {
  size?: 'md' | 'full'
}

withDefaults(defineProps<TooltipProps>(), {
  size: 'md',
})

const sizeMap: Record<string, string> = {
  md: 'w-40',
  full: 'w-64',
}
</script>

<template>
  <span
    class="p-1 text-sm text-center transform -translate-x-1/2 bg-white border-gray-500 rounded-sm shadow-md  dark:text-white tooltip dark:bg-gray-900 left-1/2"
    :class="sizeMap[size]"
  >
    <slot />
  </span>
</template>

<style lang="scss">
/**
* Global tooltip styles
*/
.has-tooltip {
  position: relative;
}

.tooltip {
  visibility: hidden;
  position: absolute;
  opacity: 0;
}

.has-tooltip:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>

<style lang="scss" scoped>
/**
* Component tooltip styles
*/
.tooltip {
  bottom: 125%;
  z-index: 1;
  transition: 200ms opacity 0.5s ease-in;
}
</style>
