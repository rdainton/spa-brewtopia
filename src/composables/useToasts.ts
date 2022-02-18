import { useToastsStore } from '@/stores/useToastsStore'
import { ToastNotification, NotificationType } from '@/types/toasts'

/**
 * Expose a hook that allows dispatch of different message types.
 * Hooks in to 'toast' vuex module.
 *
 * USAGE:
 * const dispatch = useToasts()
 * dispatch.successToast('I am the message!')
 */
export default function useToasts() {
  const toastsStore = useToastsStore()

  const dispatchToast = (toast: ToastNotification) => {
    toastsStore.create(toast)
  }

  const infoToast = (content: string, heading?: string) => {
    dispatchToast({
      type: NotificationType.info,
      heading: heading ?? 'Information',
      content: content,
    })
  }

  const warningToast = (content: string, heading?: string) => {
    dispatchToast({
      type: NotificationType.warning,
      heading: heading ?? 'Warning',
      content: content,
    })
  }

  const errorToast = (content: string, heading?: string) => {
    dispatchToast({
      type: NotificationType.error,
      heading: heading ?? 'Error',
      content: content,
    })
  }

  const successToast = (content: string, heading?: string) => {
    dispatchToast({
      type: NotificationType.success,
      heading: heading ?? 'Success',
      content: content,
    })
  }

  return {
    infoToast,
    warningToast,
    errorToast,
    successToast,
  }
}
