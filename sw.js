const CACHE_NAME = 'aditya-portfolio-v3';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/about.html',
    '/project.html',
    '/contact.html',

    '/style.css',
    '/script.js',
    '/dynamic.js',
    '/chatbot.js',
    '/tech_animation.js',
    '/background.js',
    '/interaction.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap', // External Font
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'// External Icons
];

// Install Event - Pre-cache critical assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching all: app shell and content');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

// Fetch Event - Network First, falling back to Cache (Strategy for slow net)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                // If network fails (offline or timeout), try cache
                return caches.match(event.request);
            })
    );
});
