import { useAuthStore } from '@/stores/useAuthStore'
import { useToastsStore } from '@/stores/useToastsStore'

// Types
import { NotificationType } from '@/types/toasts'
import { RouteContext } from '../middlewarePipeline'

/**
 * Protect a route from being accessed
 * by authenticated users
 */
export default function guest({ from, next }: RouteContext) {
  const authStore = useAuthStore()

  if (authStore.isLoggedIn) {
    next({ path: from.path })

    const toastsStore = useToastsStore()

    toastsStore.create({
      type: NotificationType.warning,
      heading: 'Redirected',
      content: 'You are already logged in!',
    })
  } else {
    next()
  }
}
