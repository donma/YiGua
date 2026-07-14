const CACHE_NAME = "zero1matrix-v2";

const CACHE_URLS = [
  "./",
  "./index.html",
  "./history.html",
  "./report-viewer.html",
  "./src/css/app.css",
  "./src/css/coin.css",
  "./src/js/core.js",
  "./src/js/coin-animation.js",
  "./src/js/app.js",
  "./src/data/categories.data.js",
  "./src/data/hexagrams.data.js",
  "./src/data/lines.data.js",
  "./src/data/categoryInterpretations.data.js",
  "./src/data/lineCategoryInterpretations.data.js",
  "./src/data/pairInterpretations.data.js",
  "./src/data/templates.data.js",
  "./src/data/reflectionQuestions.data.js",
  "./src/data/actionSuggestions.data.js",
  "./src/data/riskWarnings.data.js",
  "./src/assets/coins/coin-front.svg",
  "./src/assets/coins/coin-back.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_URLS).catch(e => console.warn("SW cache addAll:", e)))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
