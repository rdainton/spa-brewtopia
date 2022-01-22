<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'

// Store
import { useStore } from 'vuex'
import { GetterTypes as AuthGetters } from './store/auth/getters'
import { ActionTypes as AuthActions } from './store/auth/actions'

// Components
import TheHeader from './components/TheHeader.vue'
import TheToastNotifications from './components/TheToastNotifications.vue'
import TheLogo from './components/TheLogo.vue'

const store = useStore()
const router = useRouter()

const attemptedAutoLogin = computed(
  () => store.getters[AuthGetters.AUTO_ATTEMPTED]
)

const isLoggedIn = computed(() => store.getters[AuthGetters.IS_AUTH])

// Start routing on auto-attempt complete
watch(attemptedAutoLogin, (current: boolean, prev: boolean) => {
  if (current && !prev) {
    router.push(store.getters[AuthGetters.REDIRECT_TO])
    store.dispatch(AuthActions.CLEAR_REDIRECT_TO)
  }
})
</script>

<template>
  <div
    v-if="attemptedAutoLogin"
    class="relative flex-col hidden max-h-screen min-h-screen lg:flex min-w-screen dark:bg-gray-900"
  >
    <TheHeader>
      <!-- <TheLogo /> -->
      <div class="flex items-center ml-auto dark:text-white">
        <RouterLink
          v-if="isLoggedIn"
          :to="{ name: 'logout' }"
          class="hover:underline"
        >
          Logout
        </RouterLink>
        <RouterLink v-else :to="{ name: 'login' }" class="hover:underline">
          Login
        </RouterLink>
      </div>
    </TheHeader>

    <RouterView />
  </div>

  <div
    class="flex items-center justify-center w-screen min-h-screen lg:hidden dark:bg-gray-900"
  >
    <h1
      class="text-2xl text-center text-primary-medium dark:text-dark__primary-light"
    >
      Hey, please try a viewing this on a larger screen.
    </h1>
  </div>

  <TheToastNotifications />
</template>
