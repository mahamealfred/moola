# API Client with Language Query Parameter Support

## Overview

This implementation adds automatic language query parameter support to all API requests in your application. Every request to your server will now include the current user's selected language as the `?lang=` query parameter in the URL.

## Features

- ✅ Automatic language query parameter inclusion (`?lang=rw|fr|en`)
- ✅ Centralized API client with consistent error handling
- ✅ Support for authenticated and non-authenticated requests
- ✅ React hook for dynamic language updates
- ✅ TypeScript support with proper typing
- ✅ Easy migration from existing fetch calls

## Files Added/Modified

### New Files:
- `src/lib/api-client.ts` - Main API client with language header support
- `src/lib/use-api-with-language.ts` - React hook for language-aware API calls
- `src/lib/api-usage-examples.tsx` - Usage examples and documentation
- `src/components/LanguageHeaderTest.tsx` - Test component to verify headers

### Modified Files:
- `src/app/login/page.tsx` - Updated to use new API client
- `src/app/dashboard/transactions/page.tsx` - Updated to use new API client
- `src/app/dashboard/services/payment-services/electricity/page.tsx` - Updated to use new API client
- `src/app/landingPage/page.tsx` - Added language selector and test component

## Usage

### Basic API Calls

```typescript
import { api } from '@/lib/api-client';

// Simple POST request (automatically includes ?lang= parameter)
// URL will be: https://core-api.ddin.rw/v1/agency/auth/login?lang=rw
const response = await api.post('/agency/auth/login', {
  username: 'user',
  password: 'pass'
});

// Authenticated GET request
// URL will be: https://core-api.ddin.rw/v1/agency/transactions/history?lang=rw
const response = await api.getAuth('/agency/transactions/history');
```

### React Hook (Recommended)

```typescript
import { useApiWithLanguage } from '@/lib/use-api-with-language';

function MyComponent() {
  const api = useApiWithLanguage();
  
  const handlePayment = async () => {
    // This automatically includes the current language as query parameter
    // URL will be: /agency/services/pay?lang=rw
    const response = await api.postAuth('/agency/services/pay', paymentData);
  };
}
```

## Server-Side Implementation

Your server will receive requests with URLs like:

```
https://core-api.ddin.rw/v1/agency/auth/login?lang=rw
https://core-api.ddin.rw/v1/agency/transactions/history?lang=fr
https://core-api.ddin.rw/v1/agency/services/pay?lang=en
```

### Server Example (Node.js/Express)

```javascript
app.post('/agency/auth/login', (req, res) => {
  const language = req.query.lang || 'en'; // 'rw', 'fr', or 'en'
  
  // Return localized responses
  if (language === 'rw') {
    res.json({ message: 'Ikosa ryabaye' });
  } else if (language === 'fr') {
    res.json({ message: 'Une erreur est survenue' });
  } else {
    res.json({ message: 'An error occurred' });
  }
});

// You can also access it in middleware
app.use((req, res, next) => {
  const language = req.query.lang || 'en';
  req.language = language;
  next();
});
```

## Testing

1. Visit your landing page at `http://localhost:4005`
2. Scroll to the "Language Query Parameter Test" section
3. Switch between languages (Kinyarwanda, Français, English)
4. Click "Test API Call with Current Language"
5. Open browser dev tools (F12) → Network tab
6. Check the request URL to see `?lang=` parameter

## Migration Guide

### Before (old fetch calls):
```typescript
const response = await fetch('https://core-api.ddin.rw/v1/agency/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
```

### After (new API client):
```typescript
import { api } from '@/lib/api-client';

const response = await api.postAuth('/agency/auth/login', data);
```

## Benefits

1. **Automatic Language Parameters**: No need to manually add language parameters to each request
2. **Centralized Configuration**: All API settings in one place
3. **Error Consistency**: Standardized error handling across the app
4. **Type Safety**: Full TypeScript support
5. **Easy Testing**: Built-in test component to verify functionality
6. **Server Localization**: Server can now return localized responses

## Language Codes

The `?lang=` parameter will contain one of:
- `rw` - Kinyarwanda
- `fr` - Français 
- `en` - English

## Next Steps

1. ✅ Update remaining service files to use the new API client
2. ✅ Implement server-side language detection and localized responses
3. ✅ Add error message translations based on language header
4. ✅ Test all API endpoints with different languages