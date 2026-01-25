/**
 * Global Performance Utilities
 * Provides reusable performance optimization helpers for the entire Moola+ app
 */

/**
 * Debounce function for optimizing frequent events (search, scroll, resize)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for optimizing high-frequency events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request Animation Frame debounce for smooth animations
 */
export function rafDebounce<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

/**
 * Batch DOM updates to prevent layout thrashing
 */
export function batchDOMUpdates(updates: Array<() => void>): void {
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
}

/**
 * Intersection Observer helper for lazy loading
 */
export function observeElement(
  element: Element,
  callback: (isVisible: boolean) => void,
  options?: IntersectionObserverInit
): () => void {
  const observer = new IntersectionObserver(([entry]) => {
    callback(entry.isIntersecting);
  }, options);

  observer.observe(element);

  return () => observer.disconnect();
}

/**
 * Performance metrics tracking
 */
export class PerformanceTracker {
  private marks = new Map<string, number>();
  private measures = new Map<string, number>();

  /**
   * Start measuring
   */
  start(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * End measuring and return duration
   */
  end(name: string): number {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No start mark found for ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measures.set(name, duration);
    this.marks.delete(name);

    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  /**
   * Get all measures
   */
  getMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures);
  }

  /**
   * Clear all measures
   */
  clear(): void {
    this.marks.clear();
    this.measures.clear();
  }
}

/**
 * Memory-efficient Set for tracking unique items
 */
export class UniqueItemSet<T> {
  private set = new Set<T>();
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  add(item: T): boolean {
    if (this.set.size >= this.maxSize && !this.set.has(item)) {
      // Remove oldest item (first added)
      const iter = this.set.values().next();
      if (!iter.done) {
        this.set.delete(iter.value);
      }
    }
    const existed = this.set.has(item);
    if (!existed) {
      this.set.add(item);
      return true;
    }
    return false;
  }

  has(item: T): boolean {
    return this.set.has(item);
  }

  size(): number {
    return this.set.size;
  }

  clear(): void {
    this.set.clear();
  }
}

/**
 * Request deduplication helper
 */
export class RequestDeduplicator {
  private requests = new Map<string, Promise<any>>();

  /**
   * Execute request with deduplication
   */
  async execute<T>(
    key: string,
    request: () => Promise<T>,
    timeout: number = 5000
  ): Promise<T> {
    // Return existing request if in flight
    if (this.requests.has(key)) {
      return this.requests.get(key)!;
    }

    const promise = Promise.race([
      request(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Request timeout: ${key}`)), timeout)
      ),
    ])
      .then((result) => {
        this.requests.delete(key);
        return result;
      })
      .catch((error) => {
        this.requests.delete(key);
        throw error;
      });

    this.requests.set(key, promise);
    return promise;
  }

  /**
   * Clear specific request
   */
  clear(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Clear all requests
   */
  clearAll(): void {
    this.requests.clear();
  }
}

/**
 * Create a performance-optimized selector for DOM queries
 */
export function createDOMSelector(selector: string) {
  let cached: Element | null = null;
  let cacheTime = 0;
  const CACHE_DURATION = 1000; // 1 second cache

  return (): Element | null => {
    const now = Date.now();
    if (cached && now - cacheTime < CACHE_DURATION) {
      return cached;
    }

    cached = document.querySelector(selector);
    cacheTime = now;
    return cached;
  };
}

/**
 * Virtual scroll helper for large lists
 */
export class VirtualScroller {
  private containerHeight: number = 0;
  private itemHeight: number = 0;
  private scrollTop: number = 0;

  constructor(itemHeight: number) {
    this.itemHeight = itemHeight;
  }

  setContainerHeight(height: number): void {
    this.containerHeight = height;
  }

  setScrollTop(top: number): void {
    this.scrollTop = top;
  }

  /**
   * Get visible range
   */
  getVisibleRange(totalItems: number): { start: number; end: number } {
    const start = Math.max(0, Math.floor(this.scrollTop / this.itemHeight));
    const end = Math.min(totalItems, Math.ceil((this.scrollTop + this.containerHeight) / this.itemHeight));

    return { start, end };
  }
}

/**
 * Smart prefetch based on network conditions
 */
export function smartPrefetch(url: string): void {
  if (typeof window === 'undefined') return;

  // Check if browser supports Network Information API
  const connection = (navigator as any).connection;
  if (!connection) {
    // Fallback: prefetch if saveData is not enabled
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = url;
    document.head.appendChild(prefetchLink);
    return;
  }

  // Only prefetch on fast connections
  const effectiveType = connection.effectiveType;
  if (effectiveType === '4g' && !connection.saveData) {
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = url;
    document.head.appendChild(prefetchLink);
  }
}

export const performanceTracker = new PerformanceTracker();
export const requestDeduplicator = new RequestDeduplicator();
