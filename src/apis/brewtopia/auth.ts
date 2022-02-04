import brewtopiaClient, { apiPrefix } from './client'

export interface Authable {
  email: string
  password: string
}

export interface Registerable {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface Forgetable {
  email: string
}

export interface Resetable {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export type User = {
  name: string
  email: string
}

/**
 * Hit the sanctum endpoint
 * to set the X-XRSF-TOKEN header
 */
function _sanctum() {
  return brewtopiaClient.get('/sanctum/csrf-cookie')
}

/**
 * The Brewtopia auth services
 */
export default {
  async login(payload: Authable) {
    await _sanctum()
    return brewtopiaClient.post(`${apiPrefix}/login`, payload)
  },

  logout() {
    return brewtopiaClient.post(`${apiPrefix}/logout`)
  },

  async forgotPassword(payload: Forgetable) {
    await _sanctum()
    return brewtopiaClient.post<{
      message: string
    }>(`${apiPrefix}/forgot-password`, payload)
  },

  getUser() {
    return brewtopiaClient.get<User>(`${apiPrefix}/user`)
  },

  async resetPassword(payload: Resetable) {
    await _sanctum()
    return brewtopiaClient.post<{
      message: string
    }>(`${apiPrefix}/reset-password`, payload)
  },

  async register(payload: Registerable) {
    await _sanctum()
    return brewtopiaClient.post(`${apiPrefix}/register`, payload)
  },
}
