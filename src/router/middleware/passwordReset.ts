import { useToastsStore } from '@/stores/useToastsStore'
import { routeNames } from '..'

// Types
import { NotificationType } from '@/types/toasts'
import { RouteContext } from '../middlewarePipeline'

/**
 * Protect a route from being accessed
 * without 'email' and 'token' params.
 */
export default function passwordReset({ to, next }: RouteContext) {
  const { email, token } = to.query

  if (!email || !token) {
    next({ name: routeNames.login })

    const toastsStore = useToastsStore()

    toastsStore.create({
      type: NotificationType.warning,
      heading: 'Redirected',
      content: 'Invalid password reset request.',
    })
  } else {
    next()
  }
}
