/*
 * This is the initial API interface
 * we set the base URL for the API,
 * and add initial configuration
 */

import axios from 'axios'

const brewtopiaClient = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true, // required to handle XRSF token.
})

brewtopiaClient.defaults.headers.common['Accept'] = 'application/json'

/*
 * Add a response interceptor to logout
 * a user that's not authenticated on the server
 */
brewtopiaClient.interceptors.response.use(
  res => {
    return res
  },
  function (err) {
    if (
      err.response &&
      [401, 419].includes(err.response.status)
      // && store.getters["auth/authUser"] // and logged in in vuex
    ) {
      console.log('log me out')
      // store.dispatch("auth/logout"); // do logour.
    }
    return Promise.reject(err)
  }
)

export default brewtopiaClient
