const CACHE_VERSION = "v11";
const CACHE_NAME = `jobtrackr-cache-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

// Cache static assets during install
const STATIC_ASSETS = [
  "/offline.html",
  "/search.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never touch auth / supabase / api
  if (
    url.pathname.startsWith("/auth") ||
    url.hostname.includes("supabase") ||
    request.url.includes("/api/")
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(request);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          return cache.match(OFFLINE_URL);
        }
      }),
    );
  }

  // Handle static assets (images, CSS, JS)
  if (request.destination === "image" ||
      request.destination === "style" ||
      request.destination === "script" ||
      url.pathname.match(/\.(png|jpg|jpeg|svg|gif|ico|css|js)$/i)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          return cachedResponse;
        }
      }),
    );
  }
});
