/**
 * Combine API modules for consumption.
 */
import search from './search'

export default {
  search,
}

/**
 * A helper function to parse the
 * error map returned from the API
 */
type ScryfallErrorMap = {
  code: string
  details: string
  object: string
  status: number
}

export function parseErrorMap(map: ScryfallErrorMap) {
  // if null, return null
  if (!map) return map

  return `${map.status}: ${map.details}`
}
