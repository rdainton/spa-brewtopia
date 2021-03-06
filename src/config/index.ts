/**
 * A light wrapper around
 * the applications config
 */
export default Object.freeze({
  appName: import.meta.env.VITE_APP_NAME as string,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  apiPrefix: import.meta.env.VITE_API_PREFIX as string,
  maxDecklists: parseInt(import.meta.env.VITE_MAX_DECKLISTS as string),
  donationsUrl: import.meta.env.VITE_DONATIONS_URL as string,
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL as string,
})
