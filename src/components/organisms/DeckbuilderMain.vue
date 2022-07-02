<template>
  <!-- Adding a min-width here breaks the overflow-x for some reason -->
  <div
    class="flex flex-1 rounded-md shadow-inner bg-smoke-dark shadow-pink-light/100"
  >
    <div class="flex justify-between flex-1">
      <slot />
    </div>
  </div>
</template>
