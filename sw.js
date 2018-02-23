importScripts('./node_modules/idb/lib/idb.js');

function createDB() {

  // Create new database
  idb.open('restaurants', 1, upgradeDB => {
    
    // Create new store staticStore
    var staticStore = upgradeDB.createObjectStore('static', {
      keyPath: 'id'
    });

    staticStore.put({ id: 1, path: '/' });
    staticStore.put({ id: 2, path: '/index.html' });
    staticStore.put({ id: 3, path: '/css/styles.css' });
    staticStore.put({ id: 4, path: '/js/dbhelper.js' });
    staticStore.put({ id: 5, path: '/js/main.js' });
    staticStore.put({ id: 6, path: '/js/restaurant_info.js' });
    staticStore.put({ id: 7, path: '/node_modules/idb/lib/idb.js' });
    staticStore.put({ id: 7, path: '/node_modules/idb/lib/node.js' });

    // Create new store imageStore
    var imageStore = upgradeDB.createObjectStore('images', {
      keyPath: 'id'
    });

    imageStore.put({ id: 1, img: '/img/1.jpg' });
    imageStore.put({ id: 2, img: '/img/2.jpg' });
    imageStore.put({ id: 3, img: '/img/3.jpg' });
    imageStore.put({ id: 4, img: '/img/4.jpg' });
    imageStore.put({ id: 5, img: '/img/5.jpg' });
    imageStore.put({ id: 6, img: '/img/6.jpg' });
    imageStore.put({ id: 7, img: '/img/7.jpg' });
    imageStore.put({ id: 8, img: '/img/8.jpg' });
    imageStore.put({ id: 9, img: '/img/9.jpg' });
    imageStore.put({ id: 10, img: '/img/10.jpg' });
    
  });
}

function readDB() {
  idb.open('restaurants', 1)
  .then(db => {
    var tx = db.transaction(['staticStore', 'imageStore'], 'readonly');
    var staticStore = tx.objectStore('staticStore');
    var imageStore = tx.objectStore('imageStore');
  })
}

self.addEventListener('activate', function(event) {
    event.waitUntil(
      createDB()
    );
});
