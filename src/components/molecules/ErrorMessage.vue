<script lang="ts" setup>
import WarningIcon from '@/components/atoms/icons/WarningIcon.vue'

interface ErrorMessageProps {
  extendWrapperClasses: string
}

withDefaults(defineProps<ErrorMessageProps>(), {
  extendWrapperClasses: '',
})
</script>

<template>
  <div
    class="flex items-center p-3 text-white bg-red-500 rounded-lg shadow-sm"
    :class="[extendWrapperClasses]"
  >
    <span class="w-12 h-12 mr-3">
      <WarningIcon />
    </span>
    <slot />
  </div>
</template>
