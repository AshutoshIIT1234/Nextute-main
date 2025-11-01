const CACHE_NAME = 'nextute-v2';
const STATIC_CACHE = 'nextute-static-v2';
const RUNTIME_CACHE = 'nextute-runtime-v2';

const STATIC_ASSETS = [
  '/',
  '/favicon.png',
  '/manifest.json'
];

const CRITICAL_RESOURCES = [
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/pages/HomePage.jsx'
];

const API_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for faster updates
const STATIC_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(RUNTIME_CACHE).then(cache => {
        // Pre-cache critical resources
        return Promise.all(
          CRITICAL_RESOURCES.map(url => 
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(() => {})
          )
        );
      })
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
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

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(request).then(cachedResponse => {
          if (cachedResponse) {
            const cachedDate = new Date(cachedResponse.headers.get('date'));
            const now = new Date();
            if (now - cachedDate < API_CACHE_DURATION) {
              return cachedResponse;
            }
          }

          return fetch(request).then(response => {
            if (response.status === 200 && request.method === 'GET') {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => cachedResponse || new Response('Offline', { status: 503 }));
        });
      })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then(response => response || fetch(request))
      .catch(() => caches.match('/'))
  );
});