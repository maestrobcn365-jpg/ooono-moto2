const CACHE_NAME = 'ooono-moto-v11';
const ASSETS = [
  '/ooono-moto/',
  '/ooono-moto/index.html',
  '/ooono-moto/manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon } = event.data;
    self.registration.showNotification(title, {
      body: body,
      icon: icon || 'https://wsrv.nl/?url=raw.githubusercontent.com/twbs/icons/main/icons/speedometer2.svg&w=192&h=192&output=png&bg=000000',
      tag: 'ooono-radar-alert',
      renotify: true,
      vibrate: [250, 100, 250],
      requireInteraction: false
    });
  }
});

self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
