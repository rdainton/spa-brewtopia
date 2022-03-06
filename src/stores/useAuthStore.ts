import { defineStore } from 'pinia'
import brewtopia from '@/apis/brewtopia'
import { useDecklistStore } from '@/stores/useDecklistStore'

// Imported types
import { ErrorMap } from '@/apis/brewtopia'
import { User } from '@/apis/brewtopia/auth'
import { Authable } from '@/apis/brewtopia/auth'

interface State {
  user: User | null
  loading: boolean
  error: ErrorMap | null
  autoAttempted: boolean
}

const storageKey = 'auth'

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    user: null,
    loading: false,
    error: null,
    autoAttempted: false,
  }),

  getters: {
    isLoggedIn(state) {
      return !!state.user
    },
  },

  actions: {
    setAuthData(payload: User) {
      this.user = payload
      this.loading = false
      this.error = null

      localStorage.setItem(storageKey, new Date().toLocaleString())
    },

    setAuthError(payload: ErrorMap) {
      this.user = null
      this.loading = false
      this.error = payload
    },

    clearAuthData() {
      this.user = null
      this.loading = false
      this.error = null

      localStorage.removeItem(storageKey)
    },

    async login(payload: Authable) {
      this.loading = true

      return brewtopia.auth
        .login(payload)
        .then(() => {
          return brewtopia.auth.getUser().then(res => {
            this.setAuthData(res.data)
            return res.data
          })
        })
        .catch(err => {
          this.setAuthError(err.response.data)
          throw err
        })
    },

    async attemptAutoLogin() {
      // return early if wasn't previously authenticated.
      const previouslyAuthenticated = localStorage.getItem(storageKey)
      if (!previouslyAuthenticated) {
        this.autoAttempted = true
        return Promise.resolve()
      }

      this.loading = true

      return brewtopia.auth
        .getUser()
        .then(res => {
          this.setAuthData(res.data)
          return res.data
        })
        .catch(_ => {
          this.clearAuthData()
        })
        .finally(() => {
          this.autoAttempted = true
        })
    },

    async logout() {
      return brewtopia.auth
        .logout()
        .catch(_ => {}) // Fail silently.
        .finally(() => {
          this.clearAuthData()
          useDecklistStore().clearDecklist()
        })
    },
  },
})
