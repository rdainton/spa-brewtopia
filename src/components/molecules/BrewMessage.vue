<script lang="ts" setup>
import WarningIcon from '@/components/atoms/icons/WarningIcon.vue'
import ErrorIcon from '@/components/atoms/icons/ErrorIcon.vue'
import InfoIcon from '@/components/atoms/icons/InfoIcon.vue'
import SuccessIcon from '@/components/atoms/icons/SuccessIcon.vue'

type Variant = 'error' | 'success' | 'warning' | 'info'

interface BrewMessageProps {
  extendWrapperClasses?: string
  variant: Variant
}

withDefaults(defineProps<BrewMessageProps>(), {
  extendWrapperClasses: '',
})

const variantClasses: Record<Variant, string> = {
  error: 'bg-red-500',
  success: 'bg-green-500',
  warning: 'bg-orange-500',
  info: 'bg-blue-500',
}
</script>

<template>
  <div
    class="flex items-center p-3 text-white rounded-lg shadow-sm"
    :class="[variantClasses[variant], extendWrapperClasses]"
  >
    <span class="w-12 h-12 mr-3">
      <ErrorIcon v-if="variant === 'error'" />
      <WarningIcon v-else-if="variant === 'warning'" />
      <SuccessIcon v-else-if="variant === 'success'" />
      <InfoIcon v-else-if="variant === 'info'" />
    </span>

    <slot />
  </div>
</template>
