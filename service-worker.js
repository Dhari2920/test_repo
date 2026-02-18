importScripts("/precache-manifest.74920bfef6809322be1005a9a32e3f54.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");


try {
    if (workbox) {

        // Disable logging
        workbox.setConfig({ debug: false });

        // Force SW to activate immediately after install
        self.addEventListener("install", () => {
            self.skipWaiting()
        });

        // Activate SW immediately on reload
        self.addEventListener("activate", event => {
            event.waitUntil(self.clients.claim());
        });

        // Precaching manifest placeholder
        workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

        // Helper for expiration plugin
        var expiration = (maxEntries, maxAgeDays) =>
            new workbox.expiration.Plugin({
                maxEntries,
                maxAgeSeconds: maxAgeDays * 24 * 60 * 60
            });

        // Runtime caching for HTML: Network First
        workbox.routing.registerRoute(
            /\.html$/,
            new workbox.strategies.NetworkFirst({
                cacheName: "html-cache",
                plugins: [expiration(10, 7)]
            })
        );

        // Runtime caching for JS & CSS: Cache First
        //User Need to Refresh Two Times to get the updated JS and CSS files
        //Also precache will catch js ans css files
        // workbox.routing.registerRoute(
        //     /\.(?:js|css)$/,
        //     new workbox.strategies.StaleWhileRevalidate({
        //         cacheName: "static-resources",
        //         plugins: [expiration(50, 30)]
        //     })
        // );

        // Google Fonts caching: Cache First
        workbox.routing.registerRoute(
            /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/,
            new workbox.strategies.CacheFirst({
                cacheName: "googleapis",
                plugins: [expiration(30, 30)]
            })
        );

        // API requests: Network First
        workbox.routing.registerRoute(
            /\/api\/resource\//,
            new workbox.strategies.NetworkFirst({
                cacheName: "api-cache",
                plugins: [expiration(30, 7)]
            })
        );

    }
    else {
        console.error("Workbox could not be loaded. No offline support.");
    }

} catch (error) {
    console.error("Unable to install service worker. Possible network error.", error);
}

