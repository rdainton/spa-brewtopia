/**
 * A light wrapper around
 * the applications config
 */
export default Object.freeze({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  apiPrefix: import.meta.env.VITE_API_PREFIX as string,
  maxDecklists: parseInt(import.meta.env.VITE_MAX_DECKLISTS as string),
})
