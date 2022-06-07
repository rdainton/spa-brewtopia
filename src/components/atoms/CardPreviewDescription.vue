<script lang="ts" setup>
interface CardPreviewProps {
  name: string
  typeLine: string
  manaCost?: string
  oracleText?: string
  power?: string
  toughness?: string
}

defineProps<CardPreviewProps>()
</script>

<template>
  <div
    class="flex flex-col justify-between p-4 text-sm w-60 xl:w-72 min-h-84 xl:min-h-100 dark:text-white xl:text-base"
  >
    <div class="flex justify-between">
      <h1>
        {{ name }}
      </h1>

      <div v-if="manaCost" class="shrink-0 mr-2">
        <span>{{ manaCost }}</span>
      </div>
    </div>

    <div class="mt-auto">
      <h2 class="mb-1">
        {{ typeLine }}
      </h2>
      <p v-if="oracleText" class="text-xs whitespace-pre-line xl:text-sm">
        {{ oracleText }}
      </p>
    </div>

    <div class="h-8 text-right">
      <p v-if="power && toughness">{{ power }} / {{ toughness }}</p>
    </div>
  </div>
</template>
