<script lang="ts" setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ActionTypes as AuthActions } from '@/store/auth/actions'

const store = useStore()
const router = useRouter()

store.dispatch(AuthActions.LOGOUT).then(() => {
  router.push({ name: 'deckbuilder' })
})
</script>

<template>
  <div />
</template>
