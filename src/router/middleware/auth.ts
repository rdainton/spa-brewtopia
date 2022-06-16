import { useAuthStore } from '@/stores/useAuthStore'
import { useToastsStore } from '@/stores/useToastsStore'
import { routeNames } from '..'

// Types
import { NotificationType } from '@/types/toasts'
import { RouteContext } from '../middlewarePipeline'

/**
 * Protect a route from being accessed
 * by non-authenticated users
 */
export default function auth({ next }: RouteContext) {
  const authStore = useAuthStore()

  if (!authStore.isLoggedIn) {
    next({ name: routeNames.login })

    const toastsStore = useToastsStore()

    toastsStore.create({
      type: NotificationType.warning,
      heading: 'Redirected',
      content: 'You must be logged in to do that.',
    })
  } else {
    next()
  }
}
