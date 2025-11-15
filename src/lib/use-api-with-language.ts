// Enhanced API client hook with automatic language sync via query parameters
import { useTranslation } from './i18n-context';
import { api } from './api-client';

// Hook that provides language-aware API client
export function useApiWithLanguage() {
  const { locale } = useTranslation();

  // Note: The apiRequest function in api-client.ts already handles 
  // adding the language as a query parameter automatically,
  // so this hook just returns the standard api object
  // which will use the current locale from localStorage

  return api;
}

export default useApiWithLanguage;