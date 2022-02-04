import { GetterTypes as AuthGetters } from '@/store/auth/getters'
import { ActionTypes as ToastActions } from '@/store/toast'

// Types
import { NotificationType } from '@/types/toasts'
import { RouteContext } from '../middlewarePipeline'

/**
 * Protect a route from being accessed
 * by non-authenticated users
 */
export default function auth({ to, next, store }: RouteContext) {
  if (!store.getters[AuthGetters.IS_AUTH]) {
    next({ name: 'login' })

    store.dispatch(ToastActions.SHOW, {
      type: NotificationType.warning,
      heading: 'Redirected',
      content: 'You must be logged in to do that.',
    })
  } else {
    next()
  }
}
