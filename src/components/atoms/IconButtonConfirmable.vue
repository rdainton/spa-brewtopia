<script lang="ts" setup>
import { computed, ref } from 'vue'
import ImageIcon from '@/components/atoms/icons/ImageIcon.vue'
import Tooltip from '@/components/atoms/Tooltip.vue'

interface IconButtonConfirmableProps {
  variant?: 'default'
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

const baseStyles =
  'rounded-sm flex items-center justify-end border-smoke-light hover:border-blue-light border'

const heightStylesMap: Record<string, string> = {
  sm: 'h-4',
  md: 'h-6',
  lg: 'h-8',
  xl: 'h-10',
}

const iconWidthMap: Record<string, string> = {
  sm: 'w-4 p-1',
  md: 'w-6 p-1',
  lg: 'w-8 p-1.5',
  xl: 'w-10 p-2',
}

const textSizeStylesMap: Record<string, string> = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base',
}

const iconColorStylesMap: Record<string, string> = {
  default: 'text-blue-dark hover:text-blue-light',
}

const colorStyles = computed(() =>
  props.disabled ? 'bg-gray-700' : 'bg-gray-900'
)
</script>

<template>
  <button
    :class="[
      baseStyles,
      colorStyles,
      iconColorStylesMap[variant],
      heightStylesMap[size],
      tooltip ? 'has-tooltip' : '',
    ]"
    :disabled="disabled"
    @click="disabled ? null : handleClicked()"
    @mouseleave="reset"
  >
    <Tooltip v-if="tooltip" :below="tooltipBelow">
      {{ tooltip }}
    </Tooltip>

    <div
      v-if="confirming"
      class="py-1 pl-2 pr-1 shrink-0"
      :class="[textSizeStylesMap[size]]"
    >
      {{ confirmationText }}
    </div>

    <div :class="iconWidthMap[size]">
      <slot>
        <ImageIcon />
      </slot>
    </div>
  </button>
</template>
