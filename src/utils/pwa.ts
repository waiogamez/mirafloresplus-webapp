/**
 * PWA Registration - Miraflores Plus
 * Registro y gestión del Service Worker
 */

import { logger } from './logger';
import { analytics } from './analytics';

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  // Solo registrar en producción y si el navegador lo soporta
  if (!('serviceWorker' in navigator)) {
    logger.warn('PWA', 'Service Workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    logger.info('PWA', 'Service Worker registered successfully', {
      scope: registration.scope,
    });

    analytics.trackEvent('service_worker_registered', 'pwa', 'sw_registered', {
      properties: { scope: registration.scope }
    });

    // Verificar actualizaciones cada hora
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    // Manejar actualizaciones del Service Worker
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Hay una nueva versión disponible
          logger.info('PWA', 'New version available');
          analytics.trackEvent('service_worker_updated', 'pwa', 'sw_updated');

          // Mostrar notificación al usuario
          if (confirm('¡Hay una nueva versión disponible! ¿Deseas actualizar ahora?')) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          }
        }
      });
    });

    // Recargar cuando el SW toma control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

    return registration;
  } catch (error) {
    logger.error('PWA', 'Service Worker registration failed', { error });
    return null;
  }
};

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const success = await registration.unregister();
      logger.info('PWA', 'Service Worker unregistered', { success });
      return success;
    }
    return false;
  } catch (error) {
    logger.error('PWA', 'Service Worker unregistration failed', { error });
    return false;
  }
};

// Verificar si el SW está activo
export const isServiceWorkerActive = (): boolean => {
  return !!(
    'serviceWorker' in navigator &&
    navigator.serviceWorker.controller
  );
};

// Enviar mensaje al Service Worker
export const sendMessageToSW = async (message: any): Promise<void> => {
  if (!isServiceWorkerActive()) {
    throw new Error('Service Worker not active');
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (registration?.active) {
    registration.active.postMessage(message);
  }
};

// Background Sync API
export const requestBackgroundSync = async (tag: string): Promise<void> => {
  if (!('sync' in registration)) {
    logger.warn('PWA', 'Background Sync not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    // @ts-ignore - SyncManager experimental
    await registration.sync.register(tag);
    logger.info('PWA', 'Background sync registered', { tag });
  } catch (error) {
    logger.error('PWA', 'Background sync registration failed', { error });
  }
};

// Verificar si está en modo standalone (PWA instalada)
export const isPWAInstalled = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-ignore
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
};

// Cache Management
export const clearAppCache = async (): Promise<void> => {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    logger.info('PWA', 'All caches cleared');
    analytics.trackEvent('cache_cleared', 'pwa', 'cache_clear');
  } catch (error) {
    logger.error('PWA', 'Cache clearing failed', { error });
  }
};

// Obtener tamaño del cache
export const getCacheSize = async (): Promise<number> => {
  if (!('caches' in window)) {
    return 0;
  }

  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return totalSize;
  } catch (error) {
    logger.error('PWA', 'Failed to calculate cache size', { error });
    return 0;
  }
};

// Precargar recursos críticos
export const precacheResources = async (urls: string[]): Promise<void> => {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cache = await caches.open('miraflores-precache-v1');
    await cache.addAll(urls);
    logger.info('PWA', 'Resources precached', { count: urls.length });
  } catch (error) {
    logger.error('PWA', 'Precaching failed', { error });
  }
};

// Inicializar PWA
export const initializePWA = async (): Promise<void> => {
  // Skip en desarrollo/preview
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  if (
    currentDomain.includes('figma') ||
    currentDomain.includes('preview') ||
    currentDomain === 'localhost'
  ) {
    logger.info('PWA registration skipped en desarrollo/preview');
    return;
  }
  
  // Registrar Service Worker
  await registerServiceWorker();

  // Log si está instalado
  if (isPWAInstalled()) {
    logger.info('PWA', 'Running as installed PWA');
    analytics.trackEvent('pwa_launched', 'pwa', 'launch', {
      properties: { mode: 'standalone' }
    });
  } else {
    logger.info('PWA', 'Running in browser');
    analytics.trackEvent('app_launched', 'app', 'launch', {
      properties: { mode: 'browser' }
    });
  }

  // Precargar recursos críticos
  const criticalResources = [
    '/',
    '/styles/globals.css',
  ];
  
  await precacheResources(criticalResources);
};
