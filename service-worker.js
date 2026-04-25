const CACHE_NAME = "gamehub-cache-v4";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./games.html",
  "./about.html",
  "./download.html",
  "./manifest.json",
  "./assets/gamehub-logo.svg",
  "./css/home.css",
  "./css/games.css",
  "./css/about.css",
  "./css/download.css",
  "./js/home.js",
  "./js/games.js",
  "./js/about.js",
  "./js/download.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});