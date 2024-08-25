self.addEventListener('install', () => {
    console.log('Service worker installed: ', self);
});

self.addEventListener('activate', () => {
    console.log('Service worker activated: ', self);
});

self.addEventListener('push', (event) => {
    const data = JSON.parse(event.data.text());
    
    console.log('Push notification received', data);

    const title = data.title || 'Default Title';
    const options = {
        body: data.body || 'Default body',
        icon: data.icon || '/icons/notification-icon.png',
        badge: data.badge || '/icons/notification-badge.png',
        data: data.url || '/'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
});