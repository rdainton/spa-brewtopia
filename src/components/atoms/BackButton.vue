<script lang="ts" setup>
import { useRouter } from 'vue-router'

import BackIcon from '@/components/atoms/icons/BackIcon.vue'
// TODO: fix that back is not limited to app
// as it uses browser history.
const router = useRouter()
</script>

<template>
  <button
    @click.prevent="router.back()"
    class="flex items-center text-white hover:text-pink-light"
  >
    <span class="inline-block w-5 mr-1">
      <BackIcon />
    </span>
    Go back
  </button>
</template>
