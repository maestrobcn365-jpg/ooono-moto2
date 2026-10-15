self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Escuchar mensajes desde la app principal para lanzar notificaciones nativas
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body } = event.data;
    self.registration.showNotification(title, {
      body: body,
      icon: 'https://cdn-icons-png.flaticon.com/192/2555/2555013.png',
      badge: 'https://cdn-icons-png.flaticon.com/192/2555/2555013.png',
      tag: 'ooono-radar-alert',
      renotify: true,
      vibrate: [200, 100, 200],
      requireInteraction: false
    });
  }
});

self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
