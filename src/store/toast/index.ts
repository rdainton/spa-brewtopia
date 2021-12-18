import { Module } from 'vuex'
import { State as RootState } from '../../store'
import { v4 as uuidv4 } from 'uuid'
import { ToastNotification } from '../../types/toasts'

/**
 * State Type
 */
export type State = {
  toasts: ToastNotification[]
}

/**
 * Mutation Types
 */
enum _MutationTypes {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  SHOW = 'SHOW',
  HIDE = 'HIDE',
}

/**
 * Action Types
 */
enum _ActionTypes {
  SHOW = 'SHOW',
  HIDE = 'HIDE',
}

// PUBLIC
export enum ActionTypes {
  SHOW = 'toast/SHOW',
  HIDE = 'toast/HIDE',
}

/**
 * Getter Types
 */
// PUBLIC
enum _GetterTypes {
  ALL = 'ALL',
}

export enum GetterTypes {
  ALL = 'toast/ALL',
}

export const toastModule: Module<State, RootState> = {
  namespaced: true,

  state: () => ({
    toasts: [],
  }),

  getters: {
    [_GetterTypes.ALL]: (state: State) => state.toasts,
  },

  mutations: {
    [_MutationTypes.ADD](state: State, toast: ToastNotification) {
      state.toasts.push(toast)
    },

    [_MutationTypes.REMOVE](state: State, uuid: string) {
      state.toasts = state.toasts.filter(t => t.uuid !== uuid)
    },

    [_MutationTypes.SHOW](state: State, uuid: string) {
      state.toasts = state.toasts.map(t => {
        if (t.uuid === uuid) t.new = false
        return t
      })
    },

    [_MutationTypes.HIDE](state: State, uuid: string) {
      state.toasts = state.toasts.map(t => {
        if (t.uuid === uuid) t.removing = true
        return t
      })
    },
  },

  actions: {
    [_ActionTypes.SHOW](ctx, toast: ToastNotification) {
      toast.new = true
      toast.uuid = uuidv4()
      toast.timerId = setTimeout(
        () => ctx.dispatch(_ActionTypes.HIDE, toast.uuid),
        6000
      )
      ctx.commit(_MutationTypes.ADD, toast)
      setTimeout(() => ctx.commit(_MutationTypes.SHOW, toast.uuid), 300)
    },

    [_ActionTypes.HIDE](ctx, uuid: string) {
      ctx.commit(_MutationTypes.HIDE, uuid)

      setTimeout(() => {
        const toast = ctx.state.toasts.find(t => t.uuid === uuid)
        if (toast?.timerId) clearTimeout(toast.timerId)
        ctx.commit(_MutationTypes.REMOVE, uuid)
      }, 300)
    },
  },
}
