export type NotificationType = 'info' | 'error' | 'warning' | 'success'

export interface ToastNotification {
  uuid?: string
  new?: boolean
  removing?: boolean
  timerId?: ReturnType<typeof setTimeout>
  type: NotificationType
  heading: string
  content: string
  link?: {
    routeName: string
    linkText: string
  } | null
}
