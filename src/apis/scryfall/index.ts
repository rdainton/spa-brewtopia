/**
 * Combine API modules for consumption.
 */
import search from './search'
import collection from './collection'

export default {
  search,
  collection,
}

/**
 * A helper function to parse the
 * error map returned from the API
 */
export type ErrorMap = {
  code: string
  details: string
  object: string
  status: number
}

export function parseErrorMap(map: ErrorMap) {
  // if null, return null
  if (!map) return map

  return `${map.status}: ${map.details}`
}
