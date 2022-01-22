import { GetterTypes as AuthGetters } from '@/store/auth/getters'
import { ActionTypes as ToastActions } from '@/store/toast'

// Types
import { NotificationType } from '@/types/toasts'
import { RouteContext } from '../middlewarePipeline'

/**
 * Protect a route from being accessed
 * by authenticated users
 */
export default function guest({ from, next, store }: RouteContext) {
  if (store.getters[AuthGetters.IS_AUTH]) {
    next({ path: from.path })

    store.dispatch(ToastActions.SHOW, {
      type: NotificationType.warning,
      heading: 'Redirected',
      content: 'You are already logged in!',
    })
  } else {
    next()
  }
}
