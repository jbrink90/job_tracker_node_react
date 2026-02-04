const CACHE_VERSION = 'v3';
const CACHE_NAME = `jobtrackr-cache-${CACHE_VERSION}`;

const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/appicon-48x48.png',
  '/icons/appicon-72x72.png',
  '/icons/appicon-96x96.png',
  '/icons/appicon-128x128.png',
  '/icons/appicon-144x144.png',
  '/icons/appicon-152x152.png',
  '/icons/appicon-192x192.png',
  '/icons/appicon-256x256.png',
  '/icons/appicon-384x384.png',
  '/icons/appicon-512x512.png',
  '/screenshots/screenshot_wide.png',
  '/screenshots/screenshot_mobile.png',
  '/offline.html'
];

async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    if (
      request.method === 'GET' &&
      response &&
      response.status === 200 &&
      response.type !== 'opaque'
    ) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw err;
  }
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => {
        console.error('Precache failed:', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  // no cachey cachey for Mr. API plz
  if (request.url.includes('/api/')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;
          const offlineFallback = await caches.match('/offline.html');
          return offlineFallback;
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetchAndCache(request);
    })
  );
});