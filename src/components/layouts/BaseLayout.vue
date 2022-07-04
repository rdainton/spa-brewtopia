<template>
  <div
    class="relative flex-col max-h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] mt-16 mr-16 bg-smoke-dark bg-gradient-to-b from-smoke-dark to-purple-dark min-w-screen"
    :class="extendClasses"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    extendClasses?: string
  }>(),
  { extendClasses: '' }
)
</script>
