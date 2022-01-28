import { GetterTypes as AuthGetters } from '@/store/auth/getters'
import { ActionTypes as AuthActions } from '@/store/auth/actions'

// Types
import { RouteContext } from '../middlewarePipeline'

/**
 * Protect a route from being accessed
 * until auto-login has been attempted.
 */
export default function attemptAuthLogin({ next, store }: RouteContext) {
  if (!store.getters[AuthGetters.AUTO_ATTEMPTED]) {
    store.dispatch(AuthActions.ATTEMPT_AUTO).finally(() => {
      next()
    })
  } else {
    next()
  }
}
