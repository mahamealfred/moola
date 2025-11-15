/**
 * API Client with Language Query Parameter Support - Usage Examples
 * 
 * This example shows how to use the enhanced API client that automatically
 * includes the current language as '?lang=' query parameter in all requests.
 */

// Basic usage with the global api client
import { api } from '@/lib/api-client';

// Example 1: Simple POST request (login)
async function loginExample(username: string, password: string) {
  try {
    // The '?lang=' query parameter is automatically included with current locale
    // URL will be: /agency/auth/login?lang=rw (or fr/en)
    const response = await api.post('/agency/auth/login', {
      username,
      password
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Example 2: Authenticated GET request
async function getTransactionsExample() {
  try {
    // Uses getAuth() method which includes Authorization header and ?lang= parameter
    // URL will be: /agency/transactions/history?lang=rw
    const response = await api.getAuth('/agency/transactions/history');
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw error;
  }
}

// Example 3: Using the React hook for dynamic language updates
import { useApiWithLanguage } from '@/lib/use-api-with-language';

function ExampleComponent() {
  // This hook provides an API client that automatically updates 
  // when the user changes language
  const apiWithLang = useApiWithLanguage();
  
  const handlePayment = async (paymentData: any) => {
    try {
      // This request will include the current language in the URL
      // URL will be: /agency/services/pay?lang=rw
      const response = await apiWithLang.postAuth('/agency/services/pay', paymentData);
      const result = await response.json();
      
      // Server will receive the request with ?lang=rw (or fr/en) in the URL
      console.log('Payment result:', result);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };
  
  return (
    <button onClick={() => handlePayment({ amount: 1000 })}>
      Pay Now
    </button>
  );
}

// Example 4: Manual language override (if needed)
async function specificLanguageRequest() {
  // Note: With query parameter approach, you can override by building custom URL
  const response = await fetch('https://core-api.ddin.rw/v1/some-endpoint?lang=fr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: 'example' })
  });
  
  return response;
}

/**
 * What happens on the server side:
 * 
 * All requests will now include a query parameter like:
 * URL: https://core-api.ddin.rw/v1/agency/auth/login?lang=rw
 * 
 * Your server can read the 'lang' query parameter to:
 * 1. Return localized error messages
 * 2. Format dates/numbers according to locale
 * 3. Return translated content
 * 4. Log requests with language context
 * 
 * Example in Express.js:
 * app.post('/agency/auth/login', (req, res) => {
 *   const language = req.query.lang || 'en'; // 'rw', 'fr', or 'en'
 *   // ... handle request with language context
 * });
 */

export { 
  loginExample, 
  getTransactionsExample, 
  ExampleComponent,
  specificLanguageRequest 
};