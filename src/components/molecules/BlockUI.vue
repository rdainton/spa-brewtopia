<script lang="ts" setup>
import BrewLoading from '@/components/atoms/BrewLoading.vue'
</script>

<template>
  <div
    class="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-transparent"
  >
    <slot>
      <BrewLoading />
    </slot>
  </div>
</template>
