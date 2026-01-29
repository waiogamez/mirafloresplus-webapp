/**
 * Performance Optimization Utils - Miraflores Plus
 * Utilidades para optimización de rendimiento
 */

// Image Optimization
export const imageOptimization = {
  // Lazy loading con IntersectionObserver
  lazyLoad: (imgElement: HTMLImageElement) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px',
    });

    observer.observe(imgElement);
    return () => observer.disconnect();
  },

  // Preload de imágenes críticas
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  },

  // Generar srcset responsive
  generateSrcSet: (baseUrl: string, sizes: number[]) => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  },
};

// Code Splitting Helpers
export const dynamicImport = {
  // Preload de rutas críticas
  preloadRoute: async (importFn: () => Promise<any>) => {
    try {
      await importFn();
    } catch (error) {
      console.warn('Preload failed:', error);
    }
  },

  // Import con retry
  importWithRetry: async (
    importFn: () => Promise<any>,
    retries = 3,
    delay = 1000
  ): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        return await importFn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  },
};

// Bundle Size Optimization
export const bundleOptimization = {
  // Tree-shaking helper: importar solo lo necesario
  treeShake: <T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> => {
    return keys.reduce((acc, key) => {
      if (key in obj) {
        acc[key] = obj[key];
      }
      return acc;
    }, {} as Partial<T>);
  },

  // Lazy load de módulos pesados
  lazyLoadModule: async function <T>(
    modulePath: string,
    exportName?: string
  ): Promise<T> {
    const module = await import(/* @vite-ignore */ modulePath);
    return exportName ? module[exportName] : module.default;
  },
};

// Memory Management
export const memoryManagement = {
  // Limpiar referencias para evitar memory leaks
  cleanup: (refs: any[]) => {
    refs.forEach(ref => {
      if (ref && typeof ref === 'object') {
        if ('current' in ref) ref.current = null;
        if ('dispose' in ref && typeof ref.dispose === 'function') {
          ref.dispose();
        }
      }
    });
  },

  // Debounce para optimizar eventos
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle para limitar ejecuciones
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

// Resource Hints
export const resourceHints = {
  // DNS Prefetch
  dnsPrefetch: (domain: string) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  },

  // Preconnect
  preconnect: (url: string, crossorigin = false) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    if (crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  },

  // Prefetch
  prefetch: (url: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  },

  // Preload
  preload: (url: string, as: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
  },
};

// Virtual Scrolling Optimization
export const virtualScrolling = {
  // Calcular rango visible
  getVisibleRange: (
    scrollTop: number,
    containerHeight: number,
    itemHeight: number,
    totalItems: number,
    overscan = 3
  ) => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      totalItems - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  },

  // Calcular offset del contenedor
  getContainerStyle: (totalItems: number, itemHeight: number) => ({
    height: `${totalItems * itemHeight}px`,
    position: 'relative' as const,
  }),

  // Calcular offset del item
  getItemStyle: (index: number, itemHeight: number) => ({
    position: 'absolute' as const,
    top: `${index * itemHeight}px`,
    left: 0,
    right: 0,
    height: `${itemHeight}px`,
  }),
};

// Performance Budgets
export const performanceBudgets = {
  // Métricas objetivo
  budgets: {
    FCP: 1800, // First Contentful Paint (ms)
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100,  // First Input Delay (ms)
    CLS: 0.1,  // Cumulative Layout Shift
    TTI: 3800, // Time to Interactive (ms)
    TBT: 300,  // Total Blocking Time (ms)
  },

  // Validar si cumple con budget
  validateMetric: (metricName: keyof typeof performanceBudgets.budgets, value: number) => {
    const budget = performanceBudgets.budgets[metricName];
    const passes = value <= budget;
    return {
      passes,
      value,
      budget,
      difference: value - budget,
      percentage: (value / budget) * 100,
    };
  },

  // Reporte de performance budget
  generateReport: (metrics: Partial<Record<keyof typeof performanceBudgets.budgets, number>>) => {
    const results = Object.entries(metrics).map(([name, value]) => {
      const validation = performanceBudgets.validateMetric(
        name as keyof typeof performanceBudgets.budgets,
        value as number
      );
      return {
        metric: name,
        ...validation,
        status: validation.passes ? '✅' : '❌',
      };
    });

    const allPass = results.every(r => r.passes);
    return {
      allPass,
      results,
      summary: {
        passed: results.filter(r => r.passes).length,
        failed: results.filter(r => !r.passes).length,
        total: results.length,
      },
    };
  },
};

// Render Optimization
export const renderOptimization = {
  // Request Idle Callback wrapper
  runWhenIdle: (callback: () => void, timeout = 2000) => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(callback, { timeout });
    } else {
      setTimeout(callback, 1);
    }
  },

  // Batch updates
  batchUpdates: function (
    updates: (() => void)[],
    batchSize = 10,
    delay = 16
  ): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;
      const executeBatch = () => {
        const batch = updates.slice(index, index + batchSize);
        batch.forEach(update => update());
        index += batchSize;
        
        if (index < updates.length) {
          setTimeout(executeBatch, delay);
        } else {
          resolve();
        }
      };
      executeBatch();
    });
  },
};

// Cache Management
export const cacheManagement = {
  // Memory cache simple
  memoryCache: new Map<string, { value: any; timestamp: number; ttl: number }>(),

  set: (key: string, value: any, ttl = 60000) => {
    cacheManagement.memoryCache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });
  },

  get: (key: string): any | null => {
    const cached = cacheManagement.memoryCache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      cacheManagement.memoryCache.delete(key);
      return null;
    }

    return cached.value;
  },

  clear: () => {
    cacheManagement.memoryCache.clear();
  },

  // Cleanup de cache expirado
  cleanup: () => {
    const now = Date.now();
    for (const [key, value] of cacheManagement.memoryCache.entries()) {
      if (now - value.timestamp > value.ttl) {
        cacheManagement.memoryCache.delete(key);
      }
    }
  },
};

// Web Worker Helpers
export const webWorkerHelpers = {
  // Crear worker desde función
  createWorkerFromFunction: (fn: Function): Worker => {
    const blob = new Blob([`(${fn.toString()})()`], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    return new Worker(url);
  },

  // Ejecutar tarea en worker
  runInWorker: async function <T>(task: () => T): Promise<T> {
    return new Promise((resolve, reject) => {
      const workerCode = `
        self.onmessage = function() {
          try {
            const result = (${task.toString()})();
            self.postMessage({ success: true, result });
          } catch (error) {
            self.postMessage({ success: false, error: error.message });
          }
        };
      `;
      
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      
      worker.onmessage = (e) => {
        if (e.data.success) {
          resolve(e.data.result);
        } else {
          reject(new Error(e.data.error));
        }
        worker.terminate();
      };
      
      worker.onerror = (error) => {
        reject(error);
        worker.terminate();
      };
      
      worker.postMessage({});
    });
  },
};

// Inicializar optimizaciones automáticas
export const initPerformanceOptimizations = () => {
  // Cleanup de cache cada 5 minutos
  setInterval(() => {
    cacheManagement.cleanup();
  }, 5 * 60 * 1000);

  // DNS Prefetch para dominios externos comunes
  resourceHints.dnsPrefetch('https://fonts.googleapis.com');
  resourceHints.dnsPrefetch('https://fonts.gstatic.com');

  // Preconnect a APIs críticas (ajustar según necesidad)
  // resourceHints.preconnect('https://api.mirafloresplus.com');
};
