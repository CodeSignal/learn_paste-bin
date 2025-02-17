export const API_BASE_URL = ''; // Empty string for same-origin requests
export const API_ENDPOINTS = {
  LOGIN: `/api/login`,
  REGISTER: `/api/register`,
  SNIPPETS: `/api/snippets`,
  SNIPPET: (id: string) => `/api/snippets/${id}`,
};