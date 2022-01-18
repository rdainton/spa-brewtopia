import brewtopiaClient from './client'

function _sanctum() {
  return brewtopiaClient.get('/sanctum/csrf-cookie')
}

export default {
  async login(payload: { email: string; password: string }) {
    await _sanctum()
    return brewtopiaClient.post('/login', payload)
  },

  logout() {
    return brewtopiaClient.post('/logout')
  },

  async forgotPassword(payload: { email: string }) {
    await _sanctum()
    return brewtopiaClient.post('/forgot-password', payload)
  },

  getUser() {
    return brewtopiaClient.get<{
      data: {
        name: string
        email: string
      }
    }>('/api/user')
  },

  async resetPassword(payload: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }) {
    await _sanctum()
    return brewtopiaClient.post('/reset-password', payload)
  },

  async register(payload: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) {
    await _sanctum()
    return brewtopiaClient.post('/register', payload)
  },

  // updatePassword(payload) {
  //   return brewtopiaClient.put('/user/password', payload)
  // },

  // sendVerification(payload) {
  //   return brewtopiaClient.post('/email/verification-notification', payload)
  // },

  // updateUser(payload) {
  //   return brewtopiaClient.put('/user/profile-information', payload)
  // },
}
