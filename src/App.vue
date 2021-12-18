<script setup lang="ts">
import Deckbuilder from './components/templates/Deckbuilder.vue'
import TheHeader from './components/TheHeader.vue'
import TheToastNotifications from './components/TheToastNotifications.vue'
</script>

<template>
  <div
    class="relative flex flex-col min-h-screen min-w-screen dark:bg-gray-900"
  >
    <TheHeader>
      <span
        class="inline-block ml-auto text-4xl font-bold text-gray-200  dark:text-gray-800"
        >BREWTOPIA&trade;</span
      >
    </TheHeader>

    <Deckbuilder />
  </div>

  <TheToastNotifications />
</template>
