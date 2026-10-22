/**
 * Service Worker para funcionamento offline e instalação como PWA (F0.7).
 */
// O prefixo "body3d-" marca a geração com rede primeiro; caches "anatomia3d-" são da geração anterior, que respondia com a
// cópia guardada (o deploy do Pages troca o nome a cada publicação: .github/workflows/pages.yml).
const CACHE_NAME = 'body3d-dev';
const OLD_PREFIX = 'anatomia3d-';
/** Quanto esperar pela rede antes de responder com a cópia guardada (só quando há cópia). */
const NETWORK_TIMEOUT_MS = 6000;

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
  './dist/anatomy-leg.js',
  './dist/anatomy-circ.js',
  './dist/anatomy-resp.js',
  './dist/anatomy-digest.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-512.png',
  './assets/favicon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Adicionar recursos um a um para não abortar caso algum pacote opcional ainda não exista
      for (const url of STATIC_ASSETS) {
        try {
          // revalida com o servidor: sem isso o pré-cache pode guardar a cópia velha do cache HTTP do navegador
          await cache.add(new Request(url, { cache: 'no-cache' }));
        } catch (err) {
          console.warn('[SW] Não foi possível pré-cachear:', url, err.message);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // vindo da geração anterior, a página aberta agora saiu da cópia velha e não sabe se recarregar: recarrega-se uma vez
    const fromOldGeneration = keys.some((key) => key.startsWith(OLD_PREFIX));
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => {
      console.info('[SW] Removendo cache antigo:', key);
      return caches.delete(key);
    }));
    await self.clients.claim();
    if (fromOldGeneration) {
      const pages = await self.clients.matchAll({ type: 'window' });
      await Promise.all(pages.map((page) => page.navigate(page.url).catch(() => {})));
    }
  })());
});

self.addEventListener('fetch', (event) => {
  // Apenas métodos GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignorar esquemas não suportados (ex: chrome-extension, file)
  if (!url.protocol.startsWith('http')) return;

  // Rede primeiro, cache só sem rede: antes o cache respondia primeiro e a versão nova só aparecia na visita seguinte, então
  // quem abria o site depois de uma atualização via a versão anterior (e o app.js novo podia vir com pacotes de dados velhos).
  // A busca revalida com o servidor (`no-cache`: o GitHub Pages responde 304 ao que não mudou, sem reenviar o arquivo), então
  // abrir de novo continua rápido. Com a rede lenta demais, depois de alguns segundos vale a cópia guardada, se houver.
  // (Uma navegação não pode ser copiada com outras opções: refaz-se o pedido pela URL.)
  const fresh = event.request.mode === 'navigate'
    ? new Request(event.request.url, { cache: 'no-cache', credentials: 'same-origin' })
    : new Request(event.request, { cache: 'no-cache' });
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    const network = fetch(fresh).then((response) => {
      if (response && response.status === 200 && response.type === 'basic') {
        const toCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, toCache));
      }
      return response;
    });
    try {
      if (!cached) return await network;
      const slow = new Promise((resolve) => setTimeout(() => resolve(null), NETWORK_TIMEOUT_MS));
      return (await Promise.race([network, slow])) ?? cached;
    } catch {
      if (cached) return cached;
      // sem rede e sem cópia: a navegação cai na página inicial guardada
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      throw new Error('offline');
    }
  })());
});
