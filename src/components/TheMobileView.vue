<script lang="ts" setup>
import TheLogo from '@/components/TheLogo.vue'

withDefaults(
  defineProps<{
    extendClasses?: string
  }>(),
  { extendClasses: '' }
)

const paragraphStyle = 'mb-6 text-3xl leading-relaxed text-blue-light'
</script>

<template>
  <div
    class="flex-col justify-center w-screen min-h-screen p-4 bg-smoke-dark bg-gradient-to-b from-smoke-dark to-purple-dark/70"
    :class="extendClasses"
  >
    <article class="max-w-3xl mx-auto">
      <p :class="paragraphStyle">Hey,</p>
      <p :class="paragraphStyle">You need to use a wider screen (1024px 😎).</p>
      <p :class="paragraphStyle">
        I might fit on this device eventually, but not today!
      </p>
      <p :class="paragraphStyle">Until next time,</p>
      <div class="flex justify-center mt-6">
        <TheLogo />
      </div>
    </article>
  </div>
</template>
