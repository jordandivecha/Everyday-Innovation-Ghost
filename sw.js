const PRECACHE = 'pre-cache';
const RUNTIME = 'runtime-cache';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  '/offline/'
];

const OFFLINE_URL = [
  '/offline/'
]

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {

    // Exclude certain paths from caching
    if ( event.request.url.includes('/ghost') || // Ghost Admin
      event.request.url.includes('/signin') ||   // Signin Page
      event.request.url.includes('/signup') ||   // Signin Page
      event.request.url.includes('/account') ||  // Signin Page
<<<<<<< HEAD
      event.request.url.includes('/members') )   // Members
    {
      return false
    }

    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          }).catch(error => {
            if (cachedResponse) {
              return cachedResponse;
            } else {
              // Check if the user is offline first and is trying to navigate to a web page
              return caches.match(OFFLINE_URL);
            }
          });
        });
      })
    );
  }
});
=======
      event.request.url.includes('/members') )   // Members  
    {
      return false
    }
    if (event.request.headers.get('range')) {
      event.respondWith(returnRangeRequest(event.request, staticCacheName));
    } else {
      event.respondWith(
        caches.match(event.request).then(cachedResponse => {
          return caches.open(RUNTIME).then(cache => {
            return fetch(event.request).then(response => {
              // Put a copy of the response in the runtime cache.
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            }).catch(error => {
              if (cachedResponse) {
                return cachedResponse;
              } else {
                // Check if the user is offline first and is trying to navigate to a web page
                return caches.match(OFFLINE_URL);
              }
            });
          });
        })
      );
    }
  }
});

function returnRangeRequest(request, cacheName) {
  return caches
    .open(cacheName)
    .then(function(cache) {
      return cache.match(request.url);
    })
    .then(function(res) {
      if (!res) {
        return fetch(request)
          .then(res => {
            const clonedRes = res.clone();
            return caches
              .open(cacheName)
              .then(cache => cache.put(request, clonedRes))
              .then(() => res);
          })
          .then(res => {
            return res.arrayBuffer();
          });
      }
      return res.arrayBuffer();
    })
    .then(function(arrayBuffer) {
      const bytes = /^bytes\=(\d+)\-(\d+)?$/g.exec(
        request.headers.get('range')
      );
      if (bytes) {
        const start = Number(bytes[1]);
        const end = Number(bytes[2]) || arrayBuffer.byteLength - 1;
        return new Response(arrayBuffer.slice(start, end + 1), {
          status: 206,
          statusText: 'Partial Content',
          headers: [
            ['Content-Range', `bytes ${start}-${end}/${arrayBuffer.byteLength}`]
          ]
        });
      } else {
        return new Response(null, {
          status: 416,
          statusText: 'Range Not Satisfiable',
          headers: [['Content-Range', `*/${arrayBuffer.byteLength}`]]
        });
      }
    });
}
>>>>>>> upstream/main
