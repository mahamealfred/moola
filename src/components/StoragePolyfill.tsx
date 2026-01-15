'use client';

/**
 * This component ensures that localStorage and sessionStorage are always available
 * and have proper methods, even in environments where they might be undefined or broken
 */
export function StoragePolyfill() {
  // Initialize storage polyfills immediately on import
  if (typeof window !== 'undefined') {
    initializeStorage();
  }

  return null;
}

function initializeStorage() {
  // Fix localStorage if needed
  try {
    if (!window.localStorage || typeof window.localStorage.getItem !== 'function') {
      throw new Error('localStorage not available');
    }
    // Test that it works
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.getItem(testKey);
    window.localStorage.removeItem(testKey);
  } catch {
    const mockStorage: { [key: string]: string } = {};
    (window as any).localStorage = {
      getItem: (key: string) => {
        return mockStorage[key] ?? null;
      },
      setItem: (key: string, value: string) => {
        mockStorage[key] = String(value);
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        Object.keys(mockStorage).forEach(key => {
          delete mockStorage[key];
        });
      },
      key: (index: number) => {
        const keys = Object.keys(mockStorage);
        return keys[index] ?? null;
      },
      get length() {
        return Object.keys(mockStorage).length;
      },
    };
  }

  // Fix sessionStorage if needed
  try {
    if (!window.sessionStorage || typeof window.sessionStorage.getItem !== 'function') {
      throw new Error('sessionStorage not available');
    }
    // Test that it works
    const testKey = '__session_test__';
    window.sessionStorage.setItem(testKey, 'test');
    window.sessionStorage.getItem(testKey);
    window.sessionStorage.removeItem(testKey);
  } catch {
    const mockSessionStorage: { [key: string]: string } = {};
    (window as any).sessionStorage = {
      getItem: (key: string) => {
        return mockSessionStorage[key] ?? null;
      },
      setItem: (key: string, value: string) => {
        mockSessionStorage[key] = String(value);
      },
      removeItem: (key: string) => {
        delete mockSessionStorage[key];
      },
      clear: () => {
        Object.keys(mockSessionStorage).forEach(key => {
          delete mockSessionStorage[key];
        });
      },
      key: (index: number) => {
        const keys = Object.keys(mockSessionStorage);
        return keys[index] ?? null;
      },
      get length() {
        return Object.keys(mockSessionStorage).length;
      },
    };
  }
}
