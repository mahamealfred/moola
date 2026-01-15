/**
 * Storage initialization - must run before ANY other code accesses localStorage/sessionStorage
 * This is imported at the top of the layout to ensure it runs first
 */

// Initialize localStorage and sessionStorage polyfills before anything else tries to use them
if (typeof window !== 'undefined') {
  // Fix localStorage
  if (!window.localStorage || typeof window.localStorage.getItem !== 'function') {
    const mockStorage: { [key: string]: string } = {};
    const storage = {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = String(value);
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
      },
      key: (index: number) => Object.keys(mockStorage)[index] ?? null,
      length: Object.keys(mockStorage).length,
    };
    (window as any).localStorage = storage as any;
  }

  // Fix sessionStorage
  if (!window.sessionStorage || typeof window.sessionStorage.getItem !== 'function') {
    const mockSessionStorage: { [key: string]: string } = {};
    const storage = {
      getItem: (key: string) => mockSessionStorage[key] ?? null,
      setItem: (key: string, value: string) => {
        mockSessionStorage[key] = String(value);
      },
      removeItem: (key: string) => {
        delete mockSessionStorage[key];
      },
      clear: () => {
        Object.keys(mockSessionStorage).forEach(key => delete mockSessionStorage[key]);
      },
      key: (index: number) => Object.keys(mockSessionStorage)[index] ?? null,
      length: Object.keys(mockSessionStorage).length,
    };
    (window as any).sessionStorage = storage as any;
  }
}
