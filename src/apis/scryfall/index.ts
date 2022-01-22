import axios from 'axios'

const scryfallClient = axios.create({
  baseURL: 'https://api.scryfall.com',
})

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

export default scryfallClient
