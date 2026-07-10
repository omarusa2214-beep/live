const CACHE_NAME = 'pwa-cache-v1783689016648';
const urlsToCache = [ './', './index.html?v=v1783689016648', './offline.html?v=v1783689016648', './icon-192.png?v=v1783689016648', './icon-512.png?v=v1783689016648', './manifest.json?v=v1783689016648' ];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./offline.html?v=v1783689016648');
          }
        });
      })
  );
});