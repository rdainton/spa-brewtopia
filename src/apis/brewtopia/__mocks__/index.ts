import auth from './auth'
import decklists from './decklists'

export default {
  auth,
  decklists,
}

export type ErrorMap = {
  message: string
  errors?: {
    [key: string]: string[]
  }
}
