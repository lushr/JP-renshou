const CACHE_NAME = "japanese-drill-v4";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",

  "./set_A.json",
  "./set_B.json",
  "./set_C.json",
  "./set_D.json",
  "./set_E.json",
  "./set_F.json",

  "./manifest.json",
  "./icon.svg"
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_FILES);
    })
  );
});

// ACTIVATE (clear old caches)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// FETCH (cache first, then network fallback)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
