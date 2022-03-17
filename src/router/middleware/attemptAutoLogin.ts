import { useAuthStore } from '@/stores/useAuthStore'

// Types
import { RouteContext } from '../middlewarePipeline'

/**
 * Protect a route from being accessed
 * until auto-login has been attempted.
 */
export default function attemptAuthLogin({ next }: RouteContext) {
  const authStore = useAuthStore()

  if (!authStore.autoAttempted) {
    authStore.attemptAutoLogin().finally(() => {
      next()
    })
  } else {
    next()
  }
}
