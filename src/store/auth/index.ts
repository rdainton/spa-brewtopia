import { Module } from 'vuex'

// Imported types
import { State as RootState } from '../'
import { ErrorMap } from '@/apis/brewtopia'
import { User } from '@/apis/brewtopia/auth'

// Vuex trees
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

/**
 * State Type
 */
export type State = {
  user: User | null
  loading: boolean
  error: ErrorMap | null
  autoAttempted: boolean
}

export const authModule: Module<State, RootState> = {
  namespaced: true,

  state: () => ({
    user: null,
    loading: false,
    error: null,
    autoAttempted: false,
  }),

  mutations,

  getters,

  actions,
}
