// Network-first: altijd de nieuwste versie als er internet is, anders de offline kopie.
const CACHE = "checkoff-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // Eigen bestanden altijd bij de server navragen (niet uit de HTTP-cache van de browser),
  // anders kan een wijziging tot ~10 minuten blijven hangen.
  // (Niet voor de pagina zelf: Safari weigert een doorgestuurde pagina uit een service worker.)
  const fresh = e.request.mode !== "navigate" && new URL(e.request.url).origin === location.origin;
  e.respondWith(
    (fresh ? fetch(e.request.url, { cache: "no-cache" }) : fetch(e.request))
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
