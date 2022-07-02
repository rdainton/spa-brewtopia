<script lang="ts" setup>
interface BrewTextProps {
  extendClasses?: string
}

withDefaults(defineProps<BrewTextProps>(), {
  extendClasses: '',
})
</script>

<template>
  <p class="text-gray-100 pointer-events-none" :class="extendClasses">
    <slot />
  </p>
</template>
