// Imported types
import { ErrorMap } from '@/apis/brewtopia'
import { User } from '@/apis/brewtopia/auth'
import { State } from './'

/**
 * Mutation Types
 */
export enum _MutationTypes {
  SET_AUTH_INIT = 'SET_AUTH_INIT',
  SET_AUTH_DATA = 'SET_AUTH_DATA',
  SET_AUTH_ERROR = 'SET_AUTH_ERROR',
  CLEAR_AUTH_DATA = 'CLEAR_AUTH_DATA',
  SET_AUTO_ATTEMPTED = 'SET_AUTO_ATTEMPTED',
}

export default {
  [_MutationTypes.SET_AUTH_INIT](state: State) {
    state.loading = true
  },

  [_MutationTypes.SET_AUTH_DATA](state: State, payload: User) {
    state.user = payload
    state.loading = false
    state.error = null
  },

  [_MutationTypes.CLEAR_AUTH_DATA](state: State) {
    state.user = null
    state.loading = false
    state.error = null
  },

  [_MutationTypes.SET_AUTH_ERROR](state: State, payload: ErrorMap) {
    state.user = null
    state.loading = false
    state.error = payload
  },

  [_MutationTypes.SET_AUTO_ATTEMPTED](state: State) {
    state.autoAttempted = true
  },
}
