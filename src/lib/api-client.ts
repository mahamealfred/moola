// API Client with Language Header Support
import { type Locale } from './translations';
import { secureStorage } from './auth-context';

// Get the current locale from localStorage or default to 'rw'
function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') return 'rw';
  
  const savedLocale = localStorage.getItem('preferred-locale') as Locale;
  return savedLocale && ['rw', 'fr', 'en'].includes(savedLocale) ? savedLocale : 'rw';
}

// Base API configuration
const API_BASE_URL = 'https://core-api.ddin.rw/v1';
//const API_BASE_URL = 'http://localhost:4000/v1';

// Function to build URL with language query parameter
function buildUrlWithLanguage(endpoint: string, baseUrl: string = API_BASE_URL): string {
  const currentLocale = getCurrentLocale();
  
  // Build the full URL
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  
  // Add language query parameter
  const urlObj = new URL(url);
  urlObj.searchParams.set('lang', currentLocale);
  
  return urlObj.toString();
}

// Default headers without language
function getDefaultHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
  };
}

// Helper function to get auth headers
function getAuthHeaders(): Record<string, string> {
  const headers = getDefaultHeaders();
  
  if (typeof window !== 'undefined') {
    const token = secureStorage.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

// Enhanced fetch with automatic language headers
interface ApiRequestOptions extends RequestInit {
  includeAuth?: boolean;
  baseUrl?: string;
}

export async function apiRequest(
  endpoint: string, 
  options: ApiRequestOptions = {}
): Promise<Response> {
  const { includeAuth = false, baseUrl = API_BASE_URL, ...fetchOptions } = options;
  
  // Build the full URL with language query parameter
  const url = buildUrlWithLanguage(endpoint, baseUrl);
  
  // Merge headers with defaults
  const headers = includeAuth ? getAuthHeaders() : getDefaultHeaders();
  const mergedHeaders = { ...headers, ...fetchOptions.headers };
  
  // Make the request
  return fetch(url, {
    ...fetchOptions,
    headers: mergedHeaders,
  });
}

// Convenience methods
export const api = {
  get: (endpoint: string, options?: ApiRequestOptions) => 
    apiRequest(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data?: any, options?: ApiRequestOptions) => 
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: (endpoint: string, data?: any, options?: ApiRequestOptions) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: (endpoint: string, options?: ApiRequestOptions) => 
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
    
  // Authenticated requests
  getAuth: (endpoint: string, options?: ApiRequestOptions) => 
    apiRequest(endpoint, { ...options, method: 'GET', includeAuth: true }),
    
  postAuth: (endpoint: string, data?: any, options?: ApiRequestOptions) => 
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      includeAuth: true,
    }),
    
  putAuth: (endpoint: string, data?: any, options?: ApiRequestOptions) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      includeAuth: true,
    }),
    
  deleteAuth: (endpoint: string, options?: ApiRequestOptions) => 
    apiRequest(endpoint, { ...options, method: 'DELETE', includeAuth: true }),
};

// Hook for React components to get current locale-aware API client
export function useApiClient() {
  return api;
}

export default api;