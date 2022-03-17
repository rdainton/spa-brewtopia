<script lang="ts" setup>
type size = 'sm' | 'md' | 'lg'

interface BrewModalProps {
  show: boolean
  size?: size
  extendWrapperClasses?: string
}

withDefaults(defineProps<BrewModalProps>(), {
  size: 'md',
  extendWrapperClasses: '',
})

defineEmits<{
  (event: 'hide'): void
}>()

const sizeClasses: Record<size, string> = {
  sm: 'sm:max-w-lg',
  md: 'sm:max-w-lg md:max-w-2xl',
  lg: 'sm:max-w-lg md:max-w-2xl lg:max-w-5xl',
}

const baseClasses =
  'fixed z-50 transform -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 w-full max-w-modal p-1 max-h-screen'
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="show"
        :class="[baseClasses, sizeClasses[size], extendWrapperClasses]"
      >
        <slot />
      </div>
    </transition>

    <div
      v-if="show"
      class="fixed top-0 left-0 z-40 w-screen h-screen cursor-pointer bg-backdrop"
      @click="$emit('hide')"
    />
  </teleport>
</template>
