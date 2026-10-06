/**
 * Service Worker para funcionamento offline e instalação como PWA (F0.7).
 */
const CACHE_NAME = 'anatomia3d-v2.0.1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './dist/version.js',
  './dist/app.js',
  './dist/anatomy-data.js',
  './dist/anatomy-nerves.js',
  './dist/anatomy-body.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Adicionar recursos um a um para não abortar caso algum pacote opcional ainda não exista
      for (const url of STATIC_ASSETS) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn('[SW] Não foi possível pré-cachear:', url, err.message);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.info('[SW] Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Apenas métodos GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignorar esquemas não suportados (ex: chrome-extension, file)
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Atualiza o cache em segundo plano (stale-while-revalidate para recursos locais)
        fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response));
          }
        }).catch(() => {});
        return cached;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, toCache));
        return response;
      }).catch(() => {
        // Fallback para página inicial se navegação offline
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
