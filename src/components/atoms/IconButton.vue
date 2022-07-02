<script lang="ts" setup>
import { computed } from 'vue'
import ImageIcon from '@/components/atoms/icons/ImageIcon.vue'
import Tooltip from '@/components/atoms/Tooltip.vue'

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

const baseStyles = 'rounded-md'

const sizeStylesMap: Record<string, string> = {
  sm: 'h-4 w-4 p-1',
  md: 'h-6 w-6 p-1',
  lg: 'h-8 w-8 p-1.5',
  xl: 'h-10 w-10 p-2',
}

const iconColorStylesMap: Record<string, string> = {
  primary: 'text-dark__primary-light hover:text-dark__primary-medium',
  secondary: 'text-dark__secondary-medium hover:text-dark__secondary-light',
  default: 'text-white hover:text-gray-200',
}

const colorStyles = computed(() =>
  props.disabled ? 'bg-gray-700' : 'bg-gray-900'
)
</script>

<template>
  <button
    @click="disabled ? null : emit('clicked')"
    :disabled="disabled"
    :class="[
      baseStyles,
      sizeStylesMap[size],
      colorStyles,
      iconColorStylesMap[variant],
      tooltip ? 'has-tooltip' : '',
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
