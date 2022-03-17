<template>
  <!-- Adding a min-width here breaks the overflow-x for some reason -->
  <div class="flex flex-1 bg-gray-200 rounded-t-xl dark:bg-gray-700">
    <div class="flex justify-between flex-1">
      <slot />
    </div>
  </div>
</template>
