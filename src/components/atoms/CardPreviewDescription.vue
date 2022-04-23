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
  <div class="flex flex-col justify-between p-4 w-72 min-h-100 dark:text-white">
    <div class="flex justify-between">
      <h1>
        {{ name }}
      </h1>

      <div v-if="manaCost" class="flex-shrink-0 mr-2">
        <span>{{ manaCost }}</span>
      </div>
    </div>

    <div class="mt-auto">
      <h2 class="mb-1">
        {{ typeLine }}
      </h2>
      <p v-if="oracleText" class="text-sm whitespace-pre-line">
        {{ oracleText }}
      </p>
    </div>

    <div class="h-8 text-right">
      <p v-if="power && toughness">{{ power }} / {{ toughness }}</p>
    </div>
  </div>
</template>
