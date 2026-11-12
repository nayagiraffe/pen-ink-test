/* Pen & Ink Lab 서비스 워커: 앱 파일을 기기에 보관해 인터넷 없이도 열리게 한다.
   사용자 데이터(IndexedDB)는 건드리지 않는다. 이 파일은 빌드 때 vite.config.js 가 채워서 dist/sw.js 로 만든다. */
const CACHE = 'pil2-v0.0.1-41becfd0';
const ASSETS = ["./","./assets/index-9O4WMydk.js","./assets/index-CVXWthxm.css","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./index.html","./manifest.webmanifest","./privacy.html"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('pil2-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
  );
});
