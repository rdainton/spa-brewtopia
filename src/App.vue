<script setup lang="ts">
import Deckbuilder from './components/templates/Deckbuilder.vue'
import TheHeader from './components/TheHeader.vue'
import TheToastNotifications from './components/TheToastNotifications.vue'
import TheLogo from './components/TheLogo.vue'
</script>

<template>
  <div
    class="relative flex-col hidden max-h-screen min-h-screen  lg:flex min-w-screen dark:bg-gray-900"
  >
    <TheHeader>
      <TheLogo />
    </TheHeader>

    <Deckbuilder />
  </div>

  <div
    class="flex items-center justify-center w-screen min-h-screen  lg:hidden dark:bg-gray-900"
  >
    <h1
      class="text-2xl text-center  text-primary-medium dark:text-dark__primary-light"
    >
      Hey, please try a viewing this on a larger screen.
    </h1>
  </div>

  <TheToastNotifications />
</template>
