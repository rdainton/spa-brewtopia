import axios from 'axios'

const brewtopiaClient = axios.create({
  baseURL: 'https://api.brewtopia.com',
})

type ErrorMap = {
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

export default brewtopiaClient
