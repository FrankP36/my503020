self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("budget-app-cache").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./app.js",
        "./manifest.json",
        "./assets/logo.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
