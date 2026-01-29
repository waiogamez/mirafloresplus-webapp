/**
 * Service Worker - Miraflores Plus
 * PWA Service Worker para funcionalidad offline
 */

const CACHE_NAME = 'miraflores-plus-v1';
const RUNTIME_CACHE = 'miraflores-runtime-v1';
const IMAGE_CACHE = 'miraflores-images-v1';

// Assets estáticos para cachear
const STATIC_ASSETS = [
  '/',
  '/App.tsx',
  '/styles/globals.css',
];

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activar service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== CACHE_NAME && 
                   name !== RUNTIME_CACHE && 
                   name !== IMAGE_CACHE;
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de cache
const cacheStrategies = {
  // Cache First (imágenes, assets estáticos)
  cacheFirst: async (request) => {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(
          request.destination === 'image' ? IMAGE_CACHE : RUNTIME_CACHE
        );
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      console.error('[SW] Fetch failed:', error);
      throw error;
    }
  },

  // Network First (API calls)
  networkFirst: async (request) => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      if (cached) {
        return cached;
      }
      throw error;
    }
  },

  // Stale While Revalidate (datos que pueden estar desactualizados)
  staleWhileRevalidate: async (request) => {
    const cached = await caches.match(request);
    
    const fetchPromise = fetch(request).then((response) => {
      if (response.ok) {
        const cache = caches.open(RUNTIME_CACHE);
        cache.then((c) => c.put(request, response.clone()));
      }
      return response;
    });

    return cached || fetchPromise;
  },
};

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar peticiones del mismo origen o assets específicos
  if (url.origin !== location.origin && !url.href.includes('figma:asset')) {
    return;
  }

  // Ignorar peticiones no-GET
  if (request.method !== 'GET') {
    return;
  }

  // Estrategia según tipo de recurso
  if (request.destination === 'image' || url.href.includes('figma:asset')) {
    // Imágenes: Cache First
    event.respondWith(cacheStrategies.cacheFirst(request));
  } else if (url.pathname.startsWith('/api/')) {
    // APIs: Network First
    event.respondWith(cacheStrategies.networkFirst(request));
  } else {
    // Otros: Stale While Revalidate
    event.respondWith(cacheStrategies.staleWhileRevalidate(request));
  }
});

// Background Sync (cuando vuelve la conexión)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Aquí se pueden sincronizar datos pendientes
      Promise.resolve()
    );
  }
});

// Push Notifications (futuro)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Tienes una nueva notificación',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: data,
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Miraflores Plus', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

console.log('[SW] Service Worker loaded');
