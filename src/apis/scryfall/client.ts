/*
 * This is the initial API interface
 * we set the base URL for the API,
 * and add initial configuration
 */
import axios from 'axios'

const scryfallClient = axios.create({
  baseURL: 'https://api.scryfall.com',
})

export default scryfallClient
