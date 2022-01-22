import { createStore, createLogger } from 'vuex'

import { authModule, State as AuthState } from './auth'
import { toastModule, State as ToastState } from './toast'

export type State = {
  toast: ToastState
  auth: AuthState
}

export default createStore({
  plugins: process.env.NODE_ENV === 'production' ? [] : [createLogger()],
  modules: {
    auth: authModule,
    toast: toastModule,
  },
})
