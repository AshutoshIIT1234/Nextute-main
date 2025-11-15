const CACHE_VERSION = 'v3'; // Increment version to force update
const STATIC_CACHE = `nextute-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `nextute-runtime-${CACHE_VERSION}`;

// index.html ('/') is handled with a network-first strategy.
// Other root-level assets that don't have a hash in their name.
const STATIC_ASSETS = [
  '/favicon.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      // Pre-cache index.html for offline fallback.
      // This will be updated by the network-first strategy on subsequent visits.
      cache.add('/'); 
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete all caches that are not the current static and runtime caches
          if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-first for navigation requests (HTML pages).
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // If network is available, cache the new response for offline use.
          return caches.open(STATIC_CACHE).then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // If network fails, serve from cache.
          return caches.match(request);
        })
    );
    return;
  }

  // Stale-while-revalidate for API requests.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(cache => {
        return cache.match(request).then(cachedResponse => {
          const fetchPromise = fetch(request).then(networkResponse => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
          // Return cached response immediately if available, otherwise wait for fetch.
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Cache-first for other static assets (JS, CSS, images).
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      return cachedResponse || fetch(request).then(networkResponse => {
        return caches.open(RUNTIME_CACHE).then(cache => {
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});