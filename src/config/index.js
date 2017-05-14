export const API_BASE_URL = (
  typeof window !== 'undefined' &&
  window.__ab_config &&
  window.__ab_config.apiUrl)
  ? window.__ab_config.apiUrl
  : ''
