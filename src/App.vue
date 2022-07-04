<script setup lang="ts">
import { computed } from 'vue'

// Store
import { useAuthStore } from '@/stores/useAuthStore'

// Components
import BaseLayout from '@/components/layouts/BaseLayout.vue'
import TheHeader from '@/components/TheHeader.vue'
import TheSideNav from '@/components/TheSideNav.vue'
import TheToastNotifications from '@/components/TheToastNotifications.vue'
import TheMobileView from '@/components/TheMobileView.vue'

const authStore = useAuthStore()

const attemptedAutoLogin = computed(() => authStore.autoAttempted)
</script>

<template>
  <BaseLayout v-if="attemptedAutoLogin" extend-classes="hidden lg:flex">
    <TheHeader />
    <RouterView />
    <TheSideNav />
  </BaseLayout>

  <TheMobileView extend-classes="flex lg:hidden" />

  <TheToastNotifications />
</template>
