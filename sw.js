var staticCacheName = 'v4';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
          '/',
          '/index.html',
          '/restaurant.html',
          '/css/styles.css',
          '/js/dbhelper.js',
          '/js/main.js',
          '/js/restaurant_info.js',
          '/node_modules/idb/lib/node.js',
          '/node_modules/idb/lib/idb.js',
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

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('v') &&
            cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  )
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
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
        }).catch(function (error) {
          console.log(error);
          console.log('Not found');
        });
      }
    })
  );
});

// importScripts('./node_modules/idb/lib/idb.js');

// function createDB() {

//   // Create new database
//   idb.open('restaurants', 1, upgradeDB => {
    
//     // Create new store staticStore
//     var staticStore = upgradeDB.createObjectStore('static', {
//       keyPath: 'id'
//     });

//     staticStore.put({ id: 1, path: '/' });
//     staticStore.put({ id: 2, path: '/index.html' });
//     staticStore.put({ id: 3, path: '/css/styles.css' });
//     staticStore.put({ id: 4, path: '/js/dbhelper.js' });
//     staticStore.put({ id: 5, path: '/js/main.js' });
//     staticStore.put({ id: 6, path: '/js/restaurant_info.js' });
//     staticStore.put({ id: 7, path: '/node_modules/idb/lib/idb.js' });
//     staticStore.put({ id: 7, path: '/node_modules/idb/lib/node.js' });

//     // Create new store imageStore
//     var imageStore = upgradeDB.createObjectStore('images', {
//       keyPath: 'id'
//     });

//     imageStore.put({ id: 1, img: '/img/1.jpg' });
//     imageStore.put({ id: 2, img: '/img/2.jpg' });
//     imageStore.put({ id: 3, img: '/img/3.jpg' });
//     imageStore.put({ id: 4, img: '/img/4.jpg' });
//     imageStore.put({ id: 5, img: '/img/5.jpg' });
//     imageStore.put({ id: 6, img: '/img/6.jpg' });
//     imageStore.put({ id: 7, img: '/img/7.jpg' });
//     imageStore.put({ id: 8, img: '/img/8.jpg' });
//     imageStore.put({ id: 9, img: '/img/9.jpg' });
//     imageStore.put({ id: 10, img: '/img/10.jpg' });
    
//   });
// }

// function readDB() {
//   idb.open('restaurants', 1)
//   .then(db => {
//     var tx = db.transaction(['staticStore', 'imageStore'], 'readonly');
//     var staticStore = tx.objectStore('staticStore');
//     var imageStore = tx.objectStore('imageStore');
//   })
// }

// self.addEventListener('activate', function(event) {
//     event.waitUntil(
//       createDB()
//     );
// });
