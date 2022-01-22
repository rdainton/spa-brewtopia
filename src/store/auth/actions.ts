import brewtopia from '@/apis/brewtopia'

// Imported Types
import { ActionTree } from 'vuex'
import { State } from './'
import { State as RootState } from '../'
import { _MutationTypes } from './mutations'
import { Authable } from '@/apis/brewtopia/auth'

/**
 * Action Types
 */
enum _ActionTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ATTEMPT_AUTO = 'ATTEMPT_AUTO',
  CLEAR_AUTH_DATA = 'CLEAR_AUTH_DATA',
  SET_AUTH_DATA = 'SET_AUTH_DATA',
  CLEAR_REDIRECT_TO = 'CLEAR_REDIRECT_TO',
}

// PUBLIC
export enum ActionTypes {
  LOGIN = 'auth/LOGIN',
  LOGOUT = 'auth/LOGOUT',
  ATTEMPT_AUTO = 'auth/ATTEMPT_AUTO',
  CLEAR_AUTH_DATA = 'auth/CLEAR_AUTH_DATA',
  CLEAR_REDIRECT_TO = 'auth/CLEAR_REDIRECT_TO',
}

const storageKey = 'auth'

export default {
  [_ActionTypes.CLEAR_AUTH_DATA]({ commit }) {
    commit(_MutationTypes.CLEAR_AUTH_DATA)
    localStorage.removeItem(storageKey)
  },

  [_ActionTypes.SET_AUTH_DATA]({ commit }, payload) {
    commit(_MutationTypes.SET_AUTH_DATA, payload)
    localStorage.setItem(storageKey, new Date().toLocaleString())
  },

  [_ActionTypes.CLEAR_REDIRECT_TO]({ commit }) {
    commit(_MutationTypes.CLEAR_REDIRECT_TO)
  },

  async [_ActionTypes.LOGIN]({ commit, dispatch }, payload: Authable) {
    commit(_MutationTypes.SET_AUTH_INIT)

    return brewtopia.auth
      .login(payload)
      .then(() => {
        return brewtopia.auth.getUser().then(res => {
          dispatch(_ActionTypes.SET_AUTH_DATA, res.data)
          return res.data
        })
      })
      .catch(err => {
        commit(_MutationTypes.SET_AUTH_ERROR, err.response.data)
        throw err
      })
  },

  [_ActionTypes.ATTEMPT_AUTO]({ commit, dispatch }, redirectTo: string) {
    commit(_MutationTypes.SET_REDIRECT_TO, redirectTo)

    // return early if wasn't previously authenticated.
    const previouslyAuthenticated = localStorage.getItem(storageKey)
    if (!previouslyAuthenticated) {
      commit(_MutationTypes.SET_AUTO_ATTEMPTED)
      return
    }

    commit(_MutationTypes.SET_AUTH_INIT)

    brewtopia.auth
      .getUser()
      .then(res => {
        dispatch(_ActionTypes.SET_AUTH_DATA, res.data)
      })
      .catch(_ => {
        dispatch(_ActionTypes.CLEAR_AUTH_DATA)
      })
      .finally(() => {
        commit(_MutationTypes.SET_AUTO_ATTEMPTED)
      })
  },

  async [_ActionTypes.LOGOUT]({ dispatch }) {
    return brewtopia.auth
      .logout()
      .catch(_ => {}) // Fail silently.
      .finally(() => {
        dispatch(_ActionTypes.CLEAR_AUTH_DATA)
      })
  },
} as ActionTree<State, RootState>
