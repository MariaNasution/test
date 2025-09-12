const CACHE_NAME = 'app-shell-v1';
const OFFLINE_URL = '/index.html';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // hasil build Webpack (lihat di dist/)
  '/app.bundle.js'
  // kalau nanti ada styles.css dari plugin CSS Extract, tambahkan di sini
];

// Install Service Worker & cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker & hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network-first untuk API
  if (url.pathname.startsWith('/api/') || url.hostname.includes('your-api-domain')) {
    event.respondWith(
      fetch(event.request)
        .then(response => response)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first untuk asset lain
  event.respondWith(
    caches.match(event.request).then(resp =>
      resp || fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    )
  );
});

// Push Notification event
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

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
