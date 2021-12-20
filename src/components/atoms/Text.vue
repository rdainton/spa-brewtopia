<script lang="ts" setup>
interface TextProps {
  extendClasses?: string
}

withDefaults(defineProps<TextProps>(), {
  extendClasses: '',
})
</script>

<template>
  <p class="pointer-events-none dark:text-gray-100" :class="extendClasses">
    <slot />
  </p>
</template>
