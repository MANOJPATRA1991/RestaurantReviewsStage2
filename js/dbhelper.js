/**
 * Common database helper functions.
 */
class DBHelper {
  
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 8080 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static get dbVersion() {
    return 15;
  }

  static get checkStoreExists() {
    var bool = false;
    idb.open('restaurants-db', DBHelper.dbVersion)
    .then(function (upgradeDB) {
      bool = upgradeDB.objectStoreNames.contains('keyval');
      return bool;
    });
  }

  static createStore() {
    idb.open('restaurants-db', DBHelper.dbVersion, function (upgradeDB) {
      var store = upgradeDB.createObjectStore('keyval', {keyPath: 'id'});
      store.put([]);
      console.log('Creating store');
    });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    var bool = false;
    // idb.open('restaurants-db',DBHelper.dbVersion, function(upgradeDB) {
    //   bool = upgradeDB.objectStoreNames.contains('keyval');
    //   console.log(bool);
    // bool = DBHelper.checkStoreExists;
    // console.log(bool);
    idb.open('products', 2)
    .then(function (upgradeDB) {
      bool = upgradeDB.objectStoreNames.contains('beverages');
      console.log(bool);
    });

    idb.open('restaurants', 1, function(upgradeDB) {
      var store = upgradeDB.createObjectStore('keyval', {
        keyPath: 'id'
      });
      store.put({id: 123, name: 'coke', price: 10.99, quantity: 200});
      store.put({id: 321, name: 'pepsi', price: 8.99, quantity: 100});
      store.put({id: 222, name: 'water', price: 11.99, quantity: 300});
    });

    idb.open('products', 2, function(upgradeDB) {
      var store = upgradeDB.createObjectStore('beverages', {
        keyPath: 'id'
      });
      store.put({id: 123, name: 'coke', price: 10.99, quantity: 200});
      store.put({id: 321, name: 'pepsi', price: 8.99, quantity: 100});
      store.put({id: 222, name: 'water', price: 11.99, quantity: 300});
    });

    console.log(bool);
    if (!bool) {
      fetch(DBHelper.DATABASE_URL)
      .then(function (response) {  
        const json = response.json();
        return json;
      })
      .then(function (data) {
        idb.open('products', 2)
        .then(function (db) {
          console.log('A');
          const tx = db.transaction('beverages', 'readwrite');
          var store = tx.objectStore('beverages');
          for (let i=0; i<data.length; i++) {
            store.put(data[i]);
          }
          // return tx.complete;
          console.log('Creating store');
        });
        callback(null, data);
      })
      .catch(function (err) {
        const error = `Request failed. Returned status of ${err.status}`;
        console.log('ERROR DB: ' + err);
        callback(error, null);
      });
    } else {
      idb.open('products', 2, function(db) {
        var tx = db.transaction('beverages', 'readonly');
        var store = tx.objectStore('beverages');
        store.getAll().then(function (restaurants) {
          callback(null, restaurants);
        });
      });
    }
    
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.photograph == id);
        console.log(restaurant);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
