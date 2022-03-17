<script lang="ts" setup>
interface SectionTitleProps {
  extendClasses?: string
}

withDefaults(defineProps<SectionTitleProps>(), {
  extendClasses: '',
})
</script>

<template>
  <h2
    class="text-lg pointer-events-none dark:text-gray-100"
    :class="extendClasses"
  >
    <slot />
  </h2>
</template>
