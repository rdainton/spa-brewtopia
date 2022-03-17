<script lang="ts" setup>
import { computed, ref } from 'vue'
import ImageIcon from '@/components/atoms/icons/ImageIcon.vue'
import Tooltip from '@/components/atoms/Tooltip.vue'

interface IconButtonConfirmableProps {
  variant?: 'primary' | 'secondary' | 'default'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  tooltip?: string
  tooltipBelow?: boolean
  confirmationText?: string
}

const props = withDefaults(defineProps<IconButtonConfirmableProps>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  tooltip: '',
  tooltipBelow: false,
  confirmationText: 'Confirm',
})

const emit = defineEmits<{
  (event: 'clicked'): void
}>()

const confirming = ref(false)

function handleClicked() {
  if (confirming.value) {
    emit('clicked')
    return
  }

  confirming.value = true
}

function reset() {
  confirming.value = false
}

const baseStyles = 'rounded-full flex items-center' // box shadow?

const iconSizeStylesMap: Record<string, string> = {
  sm: 'h-4 w-4 p-1',
  md: 'h-6 w-6 p-1',
  lg: 'h-8 w-8 p-1.5',
  xl: 'h-10 w-10 p-2',
}

const textSizeStylesMap: Record<string, string> = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base',
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
    :class="[
      baseStyles,
      colorStyles,
      iconColorStylesMap[variant],
      tooltip ? 'has-tooltip' : '',
    ]"
    :disabled="disabled"
    @click="disabled ? null : handleClicked()"
    @mouseleave="reset"
  >
    <Tooltip v-if="tooltip" :below="tooltipBelow">
      {{ tooltip }}
    </Tooltip>

    <div v-if="confirming" class="py-1 pl-2" :class="[textSizeStylesMap[size]]">
      {{ confirmationText }}
    </div>

    <div :class="iconSizeStylesMap[size]">
      <slot>
        <ImageIcon />
      </slot>
    </div>
  </button>
</template>
