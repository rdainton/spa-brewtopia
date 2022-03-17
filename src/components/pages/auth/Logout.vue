<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

authStore.logout().then(() => {
  router.push({ name: 'deckbuilder' })
})
</script>

<template>
  <div />
</template>
