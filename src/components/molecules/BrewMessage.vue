<script lang="ts" setup>
import WarningIcon from '@/components/atoms/icons/WarningIcon.vue'
import SuccessIcon from '@/components/atoms/icons/SuccessIcon.vue'

interface ErrorMessageProps {
  extendWrapperClasses?: string
  type: 'error' | 'success'
}

withDefaults(defineProps<ErrorMessageProps>(), {
  extendWrapperClasses: '',
})

const typeClasses: Record<string, string> = {
  error: 'bg-red-500',
  success: 'bg-green-500',
}
</script>

<template>
  <div
    class="flex items-center p-3 text-white rounded-lg shadow-sm"
    :class="[typeClasses[type], extendWrapperClasses]"
  >
    <span class="w-12 h-12 mr-3">
      <WarningIcon v-if="type === 'error'" />
      <SuccessIcon v-else-if="type === 'success'" />
    </span>
    <slot />
  </div>
</template>
