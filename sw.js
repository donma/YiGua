const CACHE_NAME = "yigua-core-2026-07-20-v5";

const CACHE_URLS = [
  "./",
  "./index.html",
  "./history.html",
  "./report-viewer.html",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./data-release-manifest.json",
  "./src/css/app.css",
  "./src/css/coin.css",
  "./src/js/core.js",
  "./src/js/coin-animation.js",
  "./src/js/app.js",
  "./src/js/history-safety.js",
  "./src/js/pwa.js",
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
  "./src/data/verificationPolicy.data.js",
  "./src/data/interpretationMethod.data.js",
  "./src/data/classicCanon.data.js",
  "./src/data/classicTextVariants.data.js",
  "./src/assets/coins/coin-front.svg",
  "./src/assets/coins/coin-back.svg",
  "./src/assets/icons/icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_URLS))
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
  if (event.request.method !== "GET") return;
  const networkResponse = fetch(event.request);
  event.waitUntil(networkResponse.then(response => {
    if (!response || !response.ok || new URL(event.request.url).origin !== self.location.origin) return;
    return caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
  }).catch(() => undefined));
  event.respondWith(networkResponse.catch(() =>
    caches.match(event.request).then(cached => cached || (event.request.mode === "navigate" ? caches.match("./index.html") : undefined))
  ));
});
