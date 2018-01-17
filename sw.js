self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('v1').then(function(cache) {
        return cache.addAll([
            '/',
            '/index.html',
            '/restaurant.html',
            '/css/styles.css',
            '/data/restaurants.json',
            '/js/dbhelper.js',
            '/js/main.js',
            '/js/restaurant_info.js',
            '/img/1.jpg',
            '/img/2.jpg',
            '/img/3.jpg',
            '/img/4.jpg',
            '/img/5.jpg',
            '/img/6.jpg',
            '/img/7.jpg',
            '/img/8.jpg',
            '/img/9.jpg',
            '/img/10.jpg'
        ]);
      })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request).then(function (response) {
          // response may be used only once
          // we need to save clone to put one copy in cache
          // and serve second one
          let responseClone = response.clone();
          
          caches.open('v1').then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch(function () {
          console.log('Not found');
        });
      }
    }));
  });