<script lang="ts" setup>
interface BrewTextProps {
  extendClasses?: string
}

withDefaults(defineProps<BrewTextProps>(), {
  extendClasses: '',
})
</script>

<template>
  <p class="pointer-events-none dark:text-gray-100" :class="extendClasses">
    <slot />
  </p>
</template>
