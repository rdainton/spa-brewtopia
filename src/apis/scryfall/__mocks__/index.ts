import search from './search'
import collection from './collection'

export default {
  search,
  collection,
}

export type ErrorMap = {
  code: string
  details: string
  object: string
  status: number
}
