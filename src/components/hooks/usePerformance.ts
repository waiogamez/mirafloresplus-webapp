import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { isDevelopment } from '../../utils/env';

/**
 * Hook for debouncing values
 * Useful for search inputs and API calls
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttling function calls
 * Useful for scroll handlers and resize events
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Hook for lazy loading images
 * Returns true when image is in viewport
 */
export function useLazyLoad(ref: React.RefObject<HTMLElement>) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}

/**
 * Hook for tracking component render performance
 * Use in development to identify slow components
 */
export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    renderTimes.current.push(renderTime);

    if (isDevelopment() && renderTime > 16) {
      console.warn(
        `⚠️ ${componentName} took ${renderTime.toFixed(2)}ms to render (render #${renderCount.current})`
      );
    }

    startTime.current = performance.now();
  });

  return useMemo(
    () => ({
      renderCount: renderCount.current,
      averageRenderTime:
        renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length,
    }),
    []
  );
}

/**
 * Hook for memoizing expensive calculations
 * Similar to useMemo but with better performance tracking
 */
export function useExpensiveMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  label?: string
): T {
  const startTime = performance.now();
  const value = useMemo(factory, deps);
  const endTime = performance.now();

  if (isDevelopment() && endTime - startTime > 16) {
    console.warn(
      `⚠️ Expensive memo calculation${label ? ` (${label})` : ''}: ${(endTime - startTime).toFixed(2)}ms`
    );
  }

  return value;
}

/**
 * Hook for virtualization support
 * Returns visible items based on scroll position
 */
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  scrollTop: number
) {
  return useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      Math.ceil((scrollTop + containerHeight) / itemHeight),
      items.length
    );

    const visibleItems = items.slice(startIndex, endIndex);

    return {
      visibleItems,
      startIndex,
      endIndex,
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop]);
}

/**
 * Hook for prefetching data on hover
 * Useful for improving perceived performance
 */
export function usePrefetch<T>(
  fetchFn: () => Promise<T>,
  enabled: boolean = true
) {
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [prefetchedData, setPrefetchedData] = useState<T | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const prefetch = useCallback(() => {
    if (!enabled || isPrefetching || prefetchedData) return;

    // Delay prefetch by 200ms to avoid unnecessary requests
    timeoutRef.current = setTimeout(async () => {
      setIsPrefetching(true);
      try {
        const data = await fetchFn();
        setPrefetchedData(data);
      } catch (error) {
        console.error('Prefetch error:', error);
      } finally {
        setIsPrefetching(false);
      }
    }, 200);
  }, [enabled, isPrefetching, prefetchedData, fetchFn]);

  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    prefetch,
    cancelPrefetch,
    isPrefetching,
    prefetchedData,
  };
}

/**
 * Hook for tracking FPS (frames per second)
 * Useful for identifying performance bottlenecks
 */
export function useFPS() {
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number>();
  const isFirstMeasurement = useRef(true);

  useEffect(() => {
    const updateFPS = () => {
      frameCountRef.current += 1;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTimeRef.current;

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
        setFps(currentFps);
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;

        // Skip warning on first measurement and ignore very low FPS (likely initialization)
        if (isDevelopment() && !isFirstMeasurement.current && currentFps > 0 && currentFps < 30) {
          console.warn(`⚠️ Low FPS detected: ${currentFps}`);
        }
        
        isFirstMeasurement.current = false;
      }

      rafRef.current = requestAnimationFrame(updateFPS);
    };

    rafRef.current = requestAnimationFrame(updateFPS);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return fps;
}

/**
 * Hook for measuring Web Vitals
 * Tracks LCP, FID, CLS metrics
 */
export function useWebVitals() {
  const [vitals, setVitals] = useState<{
    lcp?: number;
    fid?: number;
    cls?: number;
  }>({});

  useEffect(() => {
    // This is a simplified version
    // In production, use web-vitals library
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        setVitals((v) => ({ ...v, lcp: lastEntry.renderTime || lastEntry.loadTime }));
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }

      return () => {
        lcpObserver.disconnect();
      };
    }
  }, []);

  return vitals;
}
