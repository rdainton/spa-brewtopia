// Types
import { AxiosError, AxiosInstance } from 'axios'
import { NotificationType } from '@/types/toasts'

// Router
import router from '@/router'

// Store
import store from '@/store'
import { ActionTypes as AuthActions } from '@/store/auth/actions'
import { ActionTypes as ToastActions } from '@/store/toast'

/*
 * Add a response interceptor to logout
 * a user that's not authenticated on the server,
 * or has a session timeout.
 */
export default (axiosClient: AxiosInstance) => {
  const errorInterceptor = (error: AxiosError) => {
    if (error.response && [401, 419].includes(error.response.status)) {
      store.dispatch(AuthActions.CLEAR_AUTH_DATA)

      store.dispatch(ToastActions.SHOW, {
        type: NotificationType.warning,
        heading: 'Session Timeout',
        content: 'Your session has timed out, please log in again.',
      })

      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }

  axiosClient.interceptors.response.use(res => {
    return res
  }, errorInterceptor)
}
