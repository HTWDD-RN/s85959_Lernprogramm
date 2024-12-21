// service-worker.js

// Installationsereignis: Ressourcen im Cache speichern
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('my-cache').then(function(cache) {
            return cache.addAll([
                'index.html',
                'style.css',
                'script.js',
                'manifest.json',
                "service.worker.js"
                // Weitere Ressourcen hier hinzufügen
            ]);
        })
    );
});