<script lang="ts" setup>
import { computed } from 'vue'
import ImageIcon from '../atoms/icons/ImageIcon.vue'
import Tooltip from './Tooltip.vue'

interface IconButtonProps {
  variant?: 'primary' | 'secondary' | 'default'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  tooltip?: string
  tooltipBelow?: boolean
}

const props = withDefaults(defineProps<IconButtonProps>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  tooltip: '',
  tooltipBelow: false,
})

const emit = defineEmits<{
  (event: 'clicked'): void
}>()

const baseStyles = 'rounded-full' // box shadow?

const sizeStylesMap: Record<string, string> = {
  sm: 'h-4 w-4 p-1',
  md: 'h-6 w-6 p-1',
  lg: 'h-8 w-8 p-1.5',
  xl: 'h-10 w-10 p-2',
}

const iconColorStylesMap: Record<string, string> = {
  primary:
    'text-primary-medium hover:text-primary-light dark:text-dark__primary-light dark:hover:text-dark__primary-medium',
  secondary:
    'text-secondary-medium hover:text-secondary-light dark:text-dark__secondary-medium dark:hover:text-dark__secondary-light',
  default:
    'text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-200',
}

const colorStyles = computed(() =>
  props.disabled ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-900'
)
</script>

<template>
  <button
    @click="disabled ? null : emit('clicked')"
    :disabled="disabled"
    :class="[
      baseStyles,
      sizeStylesMap[size!],
      colorStyles,
      iconColorStylesMap[variant!],
      tooltip ? 'has-tooltip' : ''
    ]"
  >
    <Tooltip v-if="tooltip" :below="tooltipBelow">
      {{ tooltip }}
    </Tooltip>
    <slot>
      <ImageIcon />
    </slot>
  </button>
</template>
