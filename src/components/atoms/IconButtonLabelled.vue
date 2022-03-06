<script lang="ts" setup>
import { computed } from 'vue'
import ImageIcon from '@/components/atoms/icons/ImageIcon.vue'
import Tooltip from '@/components/atoms/Tooltip.vue'

interface IconButtonLabelledProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  tooltip?: string
  tooltipBelow?: boolean
  label: string
}

const props = withDefaults(defineProps<IconButtonLabelledProps>(), {
  size: 'md',
  disabled: false,
  tooltip: '',
  tooltipBelow: false,
})

const emit = defineEmits<{
  (event: 'clicked'): void
}>()

const baseStyles = 'flex flex-col items-center' // box shadow?

const iconColorStyles =
  'text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-200'

const textStyles = 'uppercase text-center text-xxs'

const iconSizeStylesMap: Record<string, string> = {
  sm: 'h-4 w-4 p-1',
  md: 'h-6 w-6 p-1',
  lg: 'h-8 w-8 p-1.5',
  xl: 'h-10 w-10 p-2',
}

const colorStyles = computed(() =>
  props.disabled ? 'bg-gray-200 dark:bg-gray-700' : 'bg-transparent'
)
</script>

<template>
  <button
    @click="disabled ? null : emit('clicked')"
    :disabled="disabled"
    :class="[
      baseStyles,
      colorStyles,
      iconColorStyles,
      tooltip ? 'has-tooltip' : '',
    ]"
  >
    <Tooltip v-if="tooltip" :below="tooltipBelow">
      {{ tooltip }}
    </Tooltip>

    <div :class="iconSizeStylesMap[size]">
      <slot>
        <ImageIcon />
      </slot>
    </div>

    <span :class="textStyles">
      {{ label }}
    </span>
  </button>
</template>
