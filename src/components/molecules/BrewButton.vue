<script lang="ts" setup>
import BrewLoading from '@/components/atoms/BrewLoading.vue'

interface BrewButtonProps {
  type?: 'button' | 'submit'
  theme?: 'auth'
  size?: 'xs' | 'sm' | 'md' | 'full'
  disabled?: boolean
  working?: boolean
}

withDefaults(defineProps<BrewButtonProps>(), {
  type: 'button',
  theme: 'auth',
  size: 'full',
  disabled: false,
  working: false,
})

const emit = defineEmits<{
  (event: 'click'): void
}>()

const baseClasses =
  'active:outline-none focus:outline-none rounded-lg inline-flex items-center justify-center'

const iconBaseClasses = 'flex mr-2'

const themeClasses: Record<string, string> = {
  auth: 'bg-blue-500 hover:bg-blue-600 xl:text-lg dark:text-white',
}

const sizeClasses: Record<string, string> = {
  xs: 'min-w-24 w-auto h-6 text-xs px-2',
  sm: 'w-32 py-1 h-8 px-2',
  md: 'w-auto px-4 py-2 h-10',
  full: 'w-full py-3 h-12',
}

const iconSizeClasses: Record<string, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  full: 'h-6 w-6',
}
</script>

<template>
  <span class="flex rounded-lg shadow-sm">
    <button
      :class="[
        baseClasses,
        themeClasses[theme],
        sizeClasses[size],
        {
          'cursor-not-allowed pointer-events-none': disabled || working,
        },
      ]"
      :type="type"
      :disabled="disabled || working"
      @click="emit('click')"
    >
      <template v-if="working">
        <BrewLoading />
      </template>
      <template v-else>
        <span
          v-if="!!$slots.icon"
          :class="[iconBaseClasses, iconSizeClasses[size]]"
        >
          <slot name="icon" />
        </span>
        <slot />
      </template>
    </button>
  </span>
</template>
