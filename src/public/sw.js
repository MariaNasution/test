const CACHE_NAME = 'app-shell-v1';
const OFFLINE_URL = '/index.html'; // app shell entry
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // tambahkan file statis bundle JS/CSS Anda:
  '/bundle.js',
  '/styles.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  // hapus cache lama jika ada
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null))
      )
    ).then(() => self.clients.claim())
  );
});

// fetch strategy: cache-first for app shell, network-first for API calls
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // contoh: treat API calls as network-first (untuk data dinamis)
  if (url.pathname.startsWith('/api/') || url.hostname.includes('your-api-domain')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // optionally put into cache for offline read
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // default: cache-first
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request).catch(() => caches.match(OFFLINE_URL)))
  );
});

// Push event
self.addEventListener('push', event => {
  let payload = { title: 'Notifikasi', body: 'Ada update', url: '/' };
  try {
    if (event.data) payload = event.data.json();
  } catch (e) {}
  const options = {
    body: payload.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: payload.url }
  };
  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
  