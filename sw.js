const CACHE_NAME = 'ooono-moto-v3';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Si la petición es a internet (Blitzer, OSM, Helicópteros), NO tocarla, dejarla pasar directo
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
