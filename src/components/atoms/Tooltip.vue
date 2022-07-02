<script lang="ts" setup>
interface TooltipProps {
  size?: 'md' | 'full'
  below?: boolean
}

withDefaults(defineProps<TooltipProps>(), {
  size: 'md',
  below: false,
})

const sizeMap: Record<string, string> = {
  md: 'w-40',
  full: 'w-64',
}
</script>

<template>
  <span
    class="p-1 text-sm text-center text-white transform -translate-x-1/2 bg-gray-900 border-gray-500 rounded-sm shadow-md tooltip left-1/2"
    :class="[below ? 'tooltip-below' : 'tooltip-above', sizeMap[size]]"
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
  z-index: 1;
  transition: 200ms opacity 0.5s ease-in;

  &-above {
    bottom: 125%;
  }

  &-below {
    top: 125%;
  }
}
</style>
