import { ReactNode, useEffect, useState, memo, useRef } from 'react';
import { useFPS, useWebVitals } from './hooks/usePerformance';
import { Activity, Zap, Eye } from 'lucide-react';
import { logger } from '../utils/logger';
import { isDevelopment } from '../utils/env';

/**
 * Performance Monitor Component
 * Shows FPS and Web Vitals in development mode
 * Hidden in production
 */
export function PerformanceMonitor() {
  const fps = useFPS();
  const vitals = useWebVitals();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (isDevelopment()) {
      // Toggle visibility with Ctrl+Shift+P
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
          setIsVisible((prev) => !prev);
          logger.debug('Performance Monitor toggled', { visible: !isVisible });
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isVisible]);

  if (!isDevelopment() || !isVisible) {
    return null;
  }

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-600';
    if (fps >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white rounded-lg p-4 shadow-lg backdrop-blur-sm">
      <div className="space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-2">
          <span className="font-bold">Performance Monitor</span>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white"
            aria-label="Cerrar monitor"
          >
            ×
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3" />
          <span>FPS:</span>
          <span className={getFPSColor(fps)}>{fps}</span>
        </div>

        {vitals.lcp && (
          <div className="flex items-center gap-2">
            <Eye className="h-3 w-3" />
            <span>LCP:</span>
            <span
              className={vitals.lcp < 2500 ? 'text-green-600' : vitals.lcp < 4000 ? 'text-yellow-600' : 'text-red-600'}
            >
              {Math.round(vitals.lcp)}ms
            </span>
          </div>
        )}

        <div className="text-white/40 pt-2 border-t border-white/20">
          Press Ctrl+Shift+P to toggle
        </div>
      </div>
    </div>
  );
}

/**
 * Memoized Component Wrapper
 * Automatically memoizes a component with performance tracking
 */
interface MemoizedProps {
  children: ReactNode;
  deps?: React.DependencyList;
  name?: string;
}

export const Memoized = memo(function MemoizedComponent({
  children,
  name = 'MemoizedComponent',
}: MemoizedProps) {
  useEffect(() => {
    if (isDevelopment()) {
      logger.debug(`Memoized component rendered`, { name });
    }
  }, [name]);

  return <>{children}</>;
});

/**
 * Lazy Image Component with loading optimization
 */
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
}

export const LazyImage = memo(function LazyImage({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E',
  onLoad,
}: LazyImageProps) {
  const [imgSrc, setImgSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoading(false);
      onLoad?.();
    };
  }, [src, onLoad]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'} ${className}`}
      loading="lazy"
    />
  );
});

/**
 * Render Tracker - Debug component renders in development
 */
export function RenderTracker({ name }: { name: string }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    if (isDevelopment()) {
      logger.debug(`Component rendered`, { name, count: renderCount.current });
    }
  });

  return null;
}

/**
 * Performance Budget Component
 * Warns when component takes too long to render
 */
interface PerformanceBudgetProps {
  children: ReactNode;
  budget: number; // in milliseconds
  name: string;
}

export const PerformanceBudget = memo(function PerformanceBudget({
  children,
  budget,
  name,
}: PerformanceBudgetProps) {
  useEffect(() => {
    if (isDevelopment()) {
      const startTime = performance.now();

      requestAnimationFrame(() => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;

        if (renderTime > budget) {
          logger.warn('Performance budget exceeded', {
            component: name,
            budget: `${budget}ms`,
            actual: `${renderTime.toFixed(2)}ms`,
            exceeded: `${(renderTime - budget).toFixed(2)}ms`,
          });
        }
      });
    }
  });

  return <>{children}</>;
});

/**
 * Prefetch Link Component
 * Prefetches data when hovering over a link
 */
interface PrefetchLinkProps {
  href: string;
  children: ReactNode;
  onPrefetch?: () => Promise<void>;
  className?: string;
}

export function PrefetchLink({
  href,
  children,
  onPrefetch,
  className = '',
}: PrefetchLinkProps) {
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [isPrefetched, setIsPrefetched] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = () => {
    if (isPrefetched || !onPrefetch) return;

    timeoutRef.current = setTimeout(async () => {
      setIsPrefetching(true);
      try {
        await onPrefetch();
        setIsPrefetched(true);
      } catch (error) {
        logger.error('Prefetch error', { error });
      } finally {
        setIsPrefetching(false);
      }
    }, 200);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-prefetching={isPrefetching}
      data-prefetched={isPrefetched}
    >
      {children}
    </a>
  );
}
