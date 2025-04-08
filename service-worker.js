// const cacheName = 'route-finder-cache-v1';
// const assets = [
//     '/',
//     '/index.html',
//     '/style.css',
//     '/script.js',
//     '/manifest.json',
//     '/icons/icon-192.png',
//     '/icons/icon-512.png'
// ];
//
// self.addEventListener('install', event => {
//     event.waitUntil(
//         caches.open(cacheName)
//             .then(cache => {
//                 console.log('Caching assets...');
//                 return cache.addAll(assets);
//             })
//             .catch(err => {
//                 console.error('Error during service worker install:', err);
//             })
//     );
// });
//
// self.addEventListener('activate', event => {
//     // Clean up old caches if needed
//     const cacheWhitelist = [cacheName];
//     event.waitUntil(
//         caches.keys().then(cacheNames => {
//             return Promise.all(
//                 cacheNames.map(cache => {
//                     if (!cacheWhitelist.includes(cache)) {
//                         return caches.delete(cache);
//                     }
//                 })
//             );
//         })
//     );
// });
//
// self.addEventListener('fetch', event => {
//     console.log('Fetching:', event.request.url);
//     event.respondWith(
//         caches.match(event.request)
//             .then(response => {
//                 return response || fetch(event.request)
//                     .then(networkResponse => {
//                         // Optionally, cache the new response for later use
//                         if (event.request.method === 'GET') {
//                             caches.open(cacheName).then(cache => {
//                                 cache.put(event.request, networkResponse.clone());
//                             });
//                         }
//                         return networkResponse;
//                     });
//             })
//             .catch(err => {
//                 console.error('Error during fetch:', err);
//                 return new Response('Error fetching data', {status: 500});
//             })
//     );
// });
