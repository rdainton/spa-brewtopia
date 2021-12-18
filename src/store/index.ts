import { createStore, createLogger } from 'vuex'

import { toastModule, State as ToastState } from './toast'

export type State = {
  toast: ToastState
}

export default createStore({
  plugins: process.env.NODE_ENV === 'production' ? [] : [createLogger()],
  modules: {
    toast: toastModule,
  },
})
