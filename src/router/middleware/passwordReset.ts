import { ActionTypes as ToastActions } from '@/store/toast'

// Types
import { NotificationType } from '@/types/toasts'
import { RouteContext } from '../middlewarePipeline'

/**
 * Protect a route from being accessed
 * without 'email' and 'token' params.
 */
export default function passwordReset({ to, next, store }: RouteContext) {
  const { email, token } = to.query

  if (!email || !token) {
    next({ name: 'login' })

    store.dispatch(ToastActions.SHOW, {
      type: NotificationType.warning,
      heading: 'Redirected',
      content: 'Invalid password reset request.',
    })
  } else {
    next()
  }
}
