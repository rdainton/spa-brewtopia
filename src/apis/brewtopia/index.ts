/**
 * Combine API modules for consumption.
 */

import auth from './auth'
import decklists from './decklists'
import cards from './cards'

export default {
  auth,
  decklists,
  cards,
}

/**
 * A helper function to parse the
 * error map returned from the API
 */
export type ErrorMap = {
  message: string
  errors?: {
    [key: string]: string[]
  }
}

export function parseErrorMap(map: ErrorMap) {
  // if null, return null
  if (!map) return map

  // if there is an errors object, return the first error.
  if (map.errors) {
    return map.errors[Object.keys(map.errors)[0]][0]
  }

  return map.message
}
