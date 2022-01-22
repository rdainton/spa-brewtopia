import { State } from './'

/**
 * Getter Types
 */
export enum _GetterTypes {
  ERROR = 'ERROR',
  LOADING = 'LOADING',
  IS_AUTH = 'IS_AUTH',
  USER = 'USER',
  AUTO_ATTEMPTED = 'AUTO_ATTEMPTED',
  REDIRECT_TO = 'REDIRECT_TO',
}

// PUBLIC
export enum GetterTypes {
  ERROR = 'auth/ERROR',
  LOADING = 'auth/LOADING',
  IS_AUTH = 'auth/IS_AUTH',
  USER = 'auth/USER',
  AUTO_ATTEMPTED = 'auth/AUTO_ATTEMPTED',
  REDIRECT_TO = 'auth/REDIRECT_TO',
}

export default {
  [_GetterTypes.ERROR]: (state: State) => state.error,

  [_GetterTypes.LOADING]: (state: State) => state.loading,

  [_GetterTypes.USER]: (state: State) => state.user,

  [_GetterTypes.IS_AUTH]: (state: State) => !!state.user,

  [_GetterTypes.AUTO_ATTEMPTED]: (state: State) => state.autoAttempted,

  [_GetterTypes.REDIRECT_TO]: (state: State) => state.redirectTo,
}
