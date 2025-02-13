export const API_BASE_URL = ''; // Empty string for same-origin requests
export const API_ENDPOINTS = {
  LOGIN: `/api/login`,
  SNIPPETS: `/api/snippets`,
  SNIPPET: (id: string) => `/api/snippets/${id}`,
};