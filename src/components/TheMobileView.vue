<template>
  <div
    class="items-center justify-center w-screen min-h-screen bg-smoke-dark bg-gradient-to-b from-smoke-dark to-purple-dark"
    :class="extendClasses"
  >
    <h1 class="text-2xl text-center text-blue-light">
      Hey, please try a viewing this on a larger screen.
    </h1>
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
