import store from '../store'
import { ActionTypes as ToastActions } from '../store/toast'
import { ToastNotification } from '../types/toasts'

// expose a hook that allows dispatch of different message types
// USAGE:
// const dispatch = useToasts()
// dispatch.successToast('I am the message!')

export default function useToasts() {
  const dispatchToast = (toast: ToastNotification) => {
    store.dispatch(ToastActions.SHOW, toast)
  }

  const infoToast = (content: string, heading?: string) => {
    dispatchToast({
      type: 'info',
      heading: heading ?? 'Information',
      content: content,
    })
  }

  const warningToast = (content: string, heading?: string) => {
    dispatchToast({
      type: 'warning',
      heading: heading ?? 'Warning',
      content: content,
    })
  }

  const errorToast = (content: string, heading?: string) => {
    dispatchToast({
      type: 'error',
      heading: heading ?? 'Error',
      content: content,
    })
  }

  const successToast = (content: string, heading?: string) => {
    dispatchToast({
      type: 'success',
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
