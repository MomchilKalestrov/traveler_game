const BLOB_STORAGE_DOMAIN = "blob.vercel-storage.com";
const cacheName = 'offlineCacheV10';

const offlinePages = [
    '/offline/offline.html',
    '/offline/style.css',

    '/backgrounds/spotbg.svg',
    '/backgrounds/bg.svg',
    '/backgrounds/rbg.svg',

    '/default_assets/background.png',

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
    '/icons/arrow.svg',
    '/icons/menu.svg',

    '/media/chiseled.svg',
    '/media/person.svg',

    '/favicon.ico',
    '/favicon.png',

    '/languages/en.json',
    '/languages/bg.json'
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

            return fetch(e.request)
                .then((res) => {
                    if (url.hostname.includes(BLOB_STORAGE_DOMAIN))
                        caches.open(cacheName).then((cache) =>
                            cache.put(e.request, res.clone())
                        );
                    return res;
                })
                .catch(() => {
                    e.request.headers.get('accept').includes('text/html')
                    ?   caches.match('/offline/offline.html')
                    :   new Response(null, { status: 404 });
                });
        })
    );
});