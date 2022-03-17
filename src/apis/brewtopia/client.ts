/*
 * This is the initial API interface
 * we set the base URL for the API,
 * and add initial configuration
 */
import axios from 'axios'
import applySessionTimeoutInterceptor from './client.session-timeout'

const brewtopiaClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // required to handle XRSF token.
})

brewtopiaClient.defaults.headers.common['Accept'] = 'application/json'

applySessionTimeoutInterceptor(brewtopiaClient)

export const apiPrefix = '/api/v1'

export default brewtopiaClient
