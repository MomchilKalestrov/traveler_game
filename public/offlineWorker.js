// service-worker.js

const cacheName = 'offlineCacheV4';

const offlinePages = [
    '/offline/offline.html',
    '/offline/style.css',

    '/backgrounds/spotbg.svg',
    '/backgrounds/bg.svg',
    '/backgrounds/rbg.svg',

    '/default_assets/background.png',
    '/default_assets/badge.svg',
    '/default_assets/user.svg',

    '/fonts/ProductSans_Regular.ttf',
    '/fonts/ProductSans_Bold.ttf',
    '/fonts/ProductSans_Italic.ttf',
    '/fonts/ProductSans_Bold_Italic.ttf',

    '/icons/back.svg',
    '/icons/close.svg',
    '/icons/error.svg',
    '/icons/filter.svg',
    '/icons/Home.svg',
    '/icons/loading.svg',
    '/icons/login.svg',
    '/icons/Map.svg',
    '/icons/nouser.svg',
    '/icons/poipin.svg',
    '/icons/Profile.svg',
    '/icons/settings.svg',
    '/icons/userpin.svg',

    '/favicon.ico',
    '/favicon.png',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                // Using cacheName for opening cache
                return cache.addAll(offlinePages); // Cache multiple pages
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        // Checking if cache name is not 'v1'
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch((error) => {
            return caches.match(e.request).then((response) => {
                if (response) {
                    return response;
                } else if (e.request.headers.get('accept').includes('text/html')) {
                    // If the request is for an HTML page, return the offline page
                    return caches.match('/offline/offline.html');
                }
            });
        })
    );
});