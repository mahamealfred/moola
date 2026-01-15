/**
 * Global API Client with Caching
 * Provides unified API request handling with automatic caching, error handling, and performance optimization
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private requestQueue = new Map<string, Promise<any>>();

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache data
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

class MoolaAPIClient {
  private baseURL = 'http://localhost:4000';
  private cache = new APICache();
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  /**
   * Get Bearer token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      // Try sessionStorage first
      if (typeof window.sessionStorage !== 'undefined') {
        const encrypted = window.sessionStorage.getItem('at');
        if (encrypted) {
          try {
            const decrypted = decodeURIComponent(atob(encrypted));
            const data = JSON.parse(decrypted);
            return data.accessToken || null;
          } catch {
            // Fall through
          }
        }
      }

      // Try localStorage
      if (typeof window.localStorage !== 'undefined') {
        const token = window.localStorage.getItem('accessToken');
        if (token) return token;
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Get request headers with auth token
   */
  private getHeaders(): Record<string, string> {
    const headers = { ...this.defaultHeaders };
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Make GET request with optional caching
   */
  async get<T>(
    endpoint: string,
    options?: {
      cache?: boolean;
      cacheTTL?: number;
    }
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `GET:${url}`;

    // Check cache first
    if (options?.cache !== false) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached) {
        console.log(`[Cache HIT] ${endpoint}`);
        return cached;
      }
    }

    // Check if request already in flight (deduplication)
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey)!;
    }

    const requestPromise = fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return response.json() as Promise<T>;
      })
      .then((data) => {
        this.requestQueue.delete(cacheKey);
        // Cache successful responses
        if (options?.cache !== false) {
          this.cache.set(cacheKey, data, options?.cacheTTL || 5 * 60 * 1000);
        }
        return data;
      })
      .catch((error) => {
        this.requestQueue.delete(cacheKey);
        throw error;
      });

    this.requestQueue.set(cacheKey, requestPromise);
    return requestPromise;
  }

  /**
   * Make POST request
   */
  async post<T>(
    endpoint: string,
    data: any,
    options?: {
      cache?: boolean;
    }
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `POST:${url}`;

    // Clear related cache on POST (cache invalidation)
    if (options?.cache !== false) {
      this.cache.delete(cacheKey);
      // Also clear GET cache for same endpoint
      this.cache.delete(`GET:${url}`);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Make PUT request
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Make DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Prefetch data
   */
  async prefetch(endpoint: string, options?: { cacheTTL?: number }): Promise<void> {
    try {
      await this.get(endpoint, { cache: true, cacheTTL: options?.cacheTTL });
    } catch (error) {
      console.warn(`Failed to prefetch ${endpoint}:`, error);
    }
  }
}

// Create singleton instance
export const apiClient = new MoolaAPIClient();
