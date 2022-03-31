/*
 * This is the initial API interface
 * we set the base URL for the API,
 * and add initial configuration
 */
import config from '@/config'
import axios from 'axios'
import applySessionTimeoutInterceptor from './client.session-timeout'

const brewtopiaClient = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true, // required to handle XRSF token.
})

brewtopiaClient.defaults.headers.common['Accept'] = 'application/json'

applySessionTimeoutInterceptor(brewtopiaClient)

export const apiPrefix = config.apiPrefix

export default brewtopiaClient
