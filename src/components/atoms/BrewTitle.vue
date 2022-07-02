<script lang="ts" setup>
interface BrewTitleProps {
  extendClasses?: string
}

withDefaults(defineProps<BrewTitleProps>(), {
  extendClasses: '',
})
</script>

<template>
  <h1 class="text-3xl text-gray-100 pointer-events-none" :class="extendClasses">
    <slot />
  </h1>
</template>
