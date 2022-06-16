<script lang="ts" setup>
import { routeNames } from '@/router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

authStore.logout().then(() => {
  router.push({ name: routeNames.deckbuilder })
})
</script>

<template>
  <div />
</template>
