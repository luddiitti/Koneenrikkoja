const HOSTNAME_WHITELIST = [
    self.location.hostname,
    'fonts.gstatic.com',
    'fonts.googleapis.com',
    'cdn.jsdelivr.net'
  ];
  
  // Utility Function to hack URLs of intercepted requests
  const getFixedUrl = (req) => {
    var now = Date.now();
    var url = new URL(req.url);
  
    // Ensure HTTPS protocol
    url.protocol = self.location.protocol;
  
    // Add query for cache-busting
    if (url.hostname === self.location.hostname) {
      url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;
    }
    return url.href;
  };
  
  // Handle Service Worker Activation and Claim Clients
  self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
  });
  
  // Listen for Fetch Events
  self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
  
    // Only intercept requests in the whitelist
    if (HOSTNAME_WHITELIST.indexOf(url.hostname) > -1) {
      const cached = caches.match(event.request);
      const fixedUrl = getFixedUrl(event.request);
      const fetched = fetch(fixedUrl, { cache: 'no-store' }).then(resp => resp.clone());
  
      // Serve from network, fallback to cache
      event.respondWith(
        fetched.catch(_ => cached).then(resp => resp || cached)
      );
  
      // Update the cache with the fresh version
      event.waitUntil(
        fetched.then(response => {
          if (response.ok) {
            return caches.open('pwa-cache').then(cache => {
              return cache.put(event.request, response);
            });
          }
        }).catch(_ => { /* handle errors gracefully */ })
      );
    }
  });
  
  // Optional: Notify users of a new service worker
  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
  