export const API_BASE_URL = 'http://localhost:3001';
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  SNIPPETS: `${API_BASE_URL}/api/snippets`,
  SNIPPET: (id: string) => `${API_BASE_URL}/api/snippets/${id}`,
};