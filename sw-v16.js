const CACHE_NAME = 'ooono-moto-v16';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: event.data.icon,
      tag: 'ooono-radar-alert',
      renotify: true
    });
  }
});

self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith(self.location.origin)) return;
  // Red sin caché estricta para forzar siempre datos frescos de GitHub
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
