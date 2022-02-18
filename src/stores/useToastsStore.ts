import { defineStore } from 'pinia'
import { ToastNotification } from '@/types/toasts'
import { v4 as uuidv4 } from 'uuid'

interface State {
  toasts: ToastNotification[]
}

export const useToastsStore = defineStore('toasts', {
  state: (): State => ({
    toasts: [],
  }),

  actions: {
    show(uuid: string) {
      this.toasts = this.toasts.map(t => {
        if (t.uuid === uuid) t.new = false
        return t
      })
    },

    hide(uuid: string) {
      this.toasts = this.toasts.map(t => {
        if (t.uuid === uuid) t.removing = true
        return t
      })
    },

    create(toast: ToastNotification) {
      toast.new = true
      toast.uuid = uuidv4()
      toast.timerId = setTimeout(() => this.remove(toast.uuid!), 6000)

      this.toasts.push(toast)

      setTimeout(() => this.show(toast.uuid!), 300)
    },

    remove(uuid: string) {
      this.hide(uuid)

      setTimeout(() => {
        const toast = this.toasts.find(t => t.uuid === uuid)
        if (toast?.timerId) clearTimeout(toast.timerId)
        this.toasts = this.toasts.filter(t => t.uuid !== uuid)
      }, 300)
    },
  },
})
