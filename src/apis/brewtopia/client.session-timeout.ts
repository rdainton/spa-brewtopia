// Types
import { AxiosError, AxiosInstance } from 'axios'
import { NotificationType } from '@/types/toasts'

// Router
import router from '@/router'

// Store
import { useAuthStore } from '@/stores/useAuthStore'
import { useToastsStore } from '@/stores/useToastsStore'
import { useDecklistStore } from '@/stores/useDecklistStore'

/*
 * Add a response interceptor to logout
 * a user that's not authenticated on the server,
 * or has a session timeout.
 */
export default (axiosClient: AxiosInstance) => {
  const errorInterceptor = (error: AxiosError) => {
    const authStore = useAuthStore()
    const toastsStore = useToastsStore()
    const decklistStore = useDecklistStore()

    if (error.response && [401, 419].includes(error.response.status)) {
      authStore.clearAuthData()
      decklistStore.clearDecklist()

      toastsStore.create({
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
