<script lang="ts" setup>
interface SectionTitleProps {
  extendClasses?: string
}

withDefaults(defineProps<SectionTitleProps>(), {
  extendClasses: '',
})
</script>

<template>
  <h2 class="text-lg text-gray-100 pointer-events-none" :class="extendClasses">
    <slot />
  </h2>
</template>
