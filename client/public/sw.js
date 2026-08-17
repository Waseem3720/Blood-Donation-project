// BloodConnect Service Worker for Web Push Notifications

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {
    title: 'Blood Connect',
    message: 'A blood request was posted.'
  };

  const options = {
    body: data.message,
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  };

  event.waitUntil(self.registration.showNotification(data.title || 'Blood Connect', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
