const BLOB_STORAGE = "https://gsplsf3le8pssi3n.public.blob.vercel-storage.com";
const cacheName = 'offlineCacheV8';

const offlinePages = [
    '/offline/offline.html',
    '/offline/style.css',

    '/backgrounds/spotbg.svg',
    '/backgrounds/bg.svg',
    '/backgrounds/rbg.svg',

    '/default_assets/background.png',
    '/default_assets/badge.svg',
    '/default_assets/user.svg',

    '/fonts/Product_Sans_Regular.ttf',
    '/fonts/Product_Sans_Bold.ttf',
    '/fonts/Product_Sans_Italic.ttf',
    '/fonts/Product_Sans_Bold_Italic.ttf',

    '/icons/crowns/crown0.svg',
    '/icons/crowns/crown1.svg',
    '/icons/crowns/crown2.svg',

    '/icons/navigation/home.svg',
    '/icons/navigation/map.svg',
    '/icons/navigation/profile.svg',
    '/icons/navigation/leaderboard.svg',

    '/icons/back.svg',
    '/icons/close.svg',
    '/icons/error.svg',
    '/icons/filter.svg',
    '/icons/loading.svg',
    '/icons/login.svg',
    '/icons/nouser.svg',
    '/icons/poipin.svg',
    '/icons/settings.svg',
    '/icons/userpin.svg',

    '/favicon.ico',
    '/favicon.png',

    '/languages/en.json',
    '/languages/bg.json',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => cache.addAll(offlinePages))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName)
                        return caches.delete(cache);
                })
            )
        )
    );
});

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);
    e.respondWith(
        caches.match(e.request).then((response) => {
            if (response)
                return response;
            fetch(e.request)
                .then((res) => {
                    if (url.hostname === BLOB_STORAGE && !url.hostname.includes('profile'))
                        caches.open(cacheName)
                            .then((cache) => cache.put(e.request, res.clone()));
                    return res;
                })
                .catch(() => {
                    if (e.request.headers.get('accept').includes('text/html'))
                        return caches.match('/offline/offline.html');
                });
        })
    );
});