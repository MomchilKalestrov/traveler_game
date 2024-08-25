self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
    self.Notification.requestPermission();
});