const CACHE_NAME = 'phonebook';
const toCache = [
  '/',
  '/phonebook',
  // '/read_contacts',
  '/static/css/main.47cdc17e.css',
  '/static/css/main.b1a4f81b.css',
  '/static/js/787.db9b214f.chunk.js',
  '/static/js/main.5fb3e19f.js',
  '/static/js/main.9d4758e6.js',
  '/static/js/main.34c5b2c2.js',
  '/static/js/main.0989a788.js',
  '/static/js/main.60db011c.js',
  '/static/js/main.d65f7cfc.js',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(toCache)
      })
      .then(self.skipWaiting())
  )
})

self.addEventListener('fetch', async function(event) {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.match(event.request)
          })
      })
  )
})


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key)
            return caches.delete(key)
          }
        }))
      })
      .then(() => self.clients.claim())
  )
})