<script lang="ts" setup>
interface BrewTitleProps {
  extendClasses?: string
}

withDefaults(defineProps<BrewTitleProps>(), {
  extendClasses: '',
})
</script>

<template>
  <h1
    class="text-3xl pointer-events-none text-blue-light"
    :class="extendClasses"
  >
    <slot />
  </h1>
</template>
