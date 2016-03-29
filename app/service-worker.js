/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

'use strict';



var PrecacheConfig = [["./Scripts/angular-animate.min.js","cad64922e691af0ff0ff85e596c40589"],["./Scripts/angular-route.js","134a121866e5c6a9e50e2bfa42fdee24"],["./Scripts/angular-sanitize.js","fa82bd63af6b7781cd95781a2f39c2c9"],["./Scripts/angular-touch.min.js","90387623ddf59b18a6379ec7b89577cd"],["./Scripts/angular.js","6272db52a00cf5ce5cbedc59801bcc8a"],["./Scripts/bootstrap.js","4c24933a54aa9164ff84cf837821ac85"],["./Scripts/bootstrap.min.css","2f624089c65f12185e79925bc5a7fc42"],["./Scripts/bootstrap.min.js","2916bdd0ab40bc45f6cb6d5b99e34368"],["./Scripts/ui-bootstrap-csp.css","baa0521c1e4d47efcfbd1f6938be6759"],["./Scripts/ui-bootstrap-tpls.js","61e731c195def9b1d3e9d6cf216761c7"],["./Scripts/ui-bootstrap.js","f315a37ccc237b6c682e9e72d9652a47"],["./app.css","128c12b1c16628c5408aa8ad9475c360"],["./app.js","2b89a57d954aafcbfd6de234700afbeb"],["./components/version/interpolate-filter.js","2d7cdb2d0c9afe0ffc1c818a1094e9ae"],["./components/version/interpolate-filter_test.js","2ffb7470825b83db0aacd9994169d2ef"],["./components/version/version-directive.js","6a084aeab572eebe6bf11fb918768a29"],["./components/version/version-directive_test.js","7e7547efbfda6fb8863569ad19fb7db0"],["./components/version/version.js","3d700fd431d0244250aca8af23da1455"],["./components/version/version_test.js","b1819f560412924776c0789b63eb38f3"],["./index.html","94b127bba724c7f65054e3c756e26843"],["./manifest.json","1c3734eb8cffb6d3014440343df84e3f"],["./service-worker.js","9687466d735072e868b7f8b3a25ac9a4"],["./view1/view1.html","9cc998f6d4f1fda1e9d712059c2ef38f"],["./view1/view1.js","761336aa1a437fa62a09314b5befb21e"],["./view2/view2.html","e328baafc58bbd2ddd3c6a95f5d0d10d"],["./view2/view2.js","60583cdcbe7e350d768ebfecb2d813c2"]];
var CacheNamePrefix = 'sw-precache-v1-hhd' + (self.registration ? self.registration.scope : '') + '-';


var IgnoreUrlParametersMatching = [/^utm_/];

var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var populateCurrentCacheNames = function (precacheConfig, cacheNamePrefix, baseUrl) {
    var absoluteUrlToCacheName = {};
    var currentCacheNamesToAbsoluteUrl = {};

    precacheConfig.forEach(function(cacheOption) {
      var absoluteUrl = new URL(cacheOption[0], baseUrl).toString();
      var cacheName = cacheNamePrefix + absoluteUrl + '-' + cacheOption[1];
      currentCacheNamesToAbsoluteUrl[cacheName] = absoluteUrl;
      absoluteUrlToCacheName[absoluteUrl] = cacheName;
    });

    return {
      absoluteUrlToCacheName: absoluteUrlToCacheName,
      currentCacheNamesToAbsoluteUrl: currentCacheNamesToAbsoluteUrl
    };
  };

var stripIgnoredUrlParameters = function (originalUrl, ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var mappings = populateCurrentCacheNames(PrecacheConfig, CacheNamePrefix, self.location);
var AbsoluteUrlToCacheName = mappings.absoluteUrlToCacheName;
var CurrentCacheNamesToAbsoluteUrl = mappings.currentCacheNamesToAbsoluteUrl;

function deleteAllCaches() {
  return caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  });
}

self.addEventListener('install', function(event) {
  var now = Date.now();

  event.waitUntil(
    caches.keys().then(function(allCacheNames) {
      return Promise.all(
        Object.keys(CurrentCacheNamesToAbsoluteUrl).filter(function(cacheName) {
          return allCacheNames.indexOf(cacheName) == -1;
        }).map(function(cacheName) {
          var url = new URL(CurrentCacheNamesToAbsoluteUrl[cacheName]);
          // Put in a cache-busting parameter to ensure we're caching a fresh response.
          if (url.search) {
            url.search += '&';
          }
          url.search += 'sw-precache=' + now;
          var urlWithCacheBusting = url.toString();

          console.log('Adding URL "%s" to cache named "%s"', urlWithCacheBusting, cacheName);
          return caches.open(cacheName).then(function(cache) {
            var request = new Request(urlWithCacheBusting, {credentials: 'same-origin'});
            return fetch(request.clone()).then(function(response) {
              if (response.status == 200) {
                return cache.put(request, response);
              } else {
                console.error('Request for %s returned a response with status %d, so not attempting to cache it.',
                  urlWithCacheBusting, response.status);
                // Get rid of the empty cache if we can't add a successful response to it.
                return caches.delete(cacheName);
              }
            });
          });
        })
      ).then(function() {
        return Promise.all(
          allCacheNames.filter(function(cacheName) {
            return cacheName.indexOf(CacheNamePrefix) == 0 &&
                   !(cacheName in CurrentCacheNamesToAbsoluteUrl);
          }).map(function(cacheName) {
            console.log('Deleting out-of-date cache "%s"', cacheName);
            return caches.delete(cacheName);
          })
        )
      });
    }).then(function() {
      if (typeof self.skipWaiting == 'function') {
        // Force the SW to transition from installing -> active state
        self.skipWaiting();
      }
    })
  );
});

if (self.clients && (typeof self.clients.claim == 'function')) {
  self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
  });
}

self.addEventListener('message', function(event) {
  if (event.data.command == 'delete_all') {
    console.log('About to delete all caches...');
    deleteAllCaches().then(function() {
      console.log('Caches deleted.');
      event.ports[0].postMessage({
        error: null
      });
    }).catch(function(error) {
      console.log('Caches not deleted:', error);
      event.ports[0].postMessage({
        error: error
      });
    });
  }
});

var fetchEvent = null;

self.addEventListener('fetch', function(event) {
  fetchEvent = event;
  if (event.request.method == 'GET') {
    var urlWithoutIgnoredParameters = stripIgnoredUrlParameters(event.request.url, IgnoreUrlParametersMatching);

    console.log("================" + urlWithoutIgnoredParameters + ", " + urlWithoutIgnoredParameters.indexOf('tote'))
    var cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];

    var directoryIndex = 'index.html';
    if (!cacheName && directoryIndex) {
      urlWithoutIgnoredParameters = addDirectoryIndex(urlWithoutIgnoredParameters, directoryIndex);
      cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
    }

    if (cacheName) {
      event.respondWith(
        // We can't call cache.match(event.request) since the entry in the cache will contain the
        // cache-busting parameter. Instead, rely on the fact that each cache should only have one
        // entry, and return that.
        caches.open(cacheName).then(function(cache) {
          return cache.keys().then(function(keys) {
            return cache.match(keys[0]).then(function(response) {
              return response || fetch(event.request).catch(function(e) {
                console.error('Fetch for "%s" failed: %O', urlWithoutIgnoredParameters, e);
              });
            });
          });
        }).catch(function(e) {
          console.error('Couldn\'t serve response for "%s" from cache: %O', urlWithoutIgnoredParameters, e);
          return fetch(event.request);
        })
      );
    }

    if(urlWithoutIgnoredParameters.indexOf('tote') > 0 ){
      var toteResponse = null;
      toteResponse = getValueFromDatabase(event.request.url, onGetCallback);
      console.log("toteResponse = " + toteResponse);
    }

  }
});

function onGetCallback(dbResult){
    if(!dbResult) {
      console.log("### Tote result NOT in DB = " + dbResult);
      fetch(fetchEvent.request.clone()).then(function(response) {
        console.log(response.headers.get('Content-Type'));
        if (response.status < 400)
          return response.text();
      }).then(function(text){
        console.log("In response + TEXT + " + text);
        putValueInDatabase(fetchEvent.request.url, text);

        clients.matchAll().then(function (clients) {
          clients.forEach(function (client) {
            client.postMessage({
              type: 'toteResponse',
              toteResponse: text
            });
          });
        });

      }).catch(function(error) {
        console.log(error);
        // The catch() will be triggered for network failures.
        // throw error;
        return error;  // return from indexedDB.
      });
    }else{
      console.log("### Tote result found in DB = " + dbResult);

      clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
          client.postMessage({
            type: 'toteResponse',
            toteResponse: dbResult
          });
        });
      });

      return dbResult;
    }
}


var idbDatabase;
var IDB_VERSION = 1;
var STORE_NAME = 'totes';
var DB_NAME = 'hhd';
var tote_requests = [];

//var openCopy = indexedDB && indexedDB.open;

// This is basic boilerplate for interacting with IndexedDB. Adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
function openDatabase() {
  console.log('In openDB')
  var indexedDBOpenRequest = indexedDB.open(DB_NAME, IDB_VERSION);
  indexedDBOpenRequest.onerror = function(error) {
    console.error('IndexedDB Open error:', error);
  };

  indexedDBOpenRequest.onupgradeneeded = function(e) {
    var idb = e.target.result;
    if (idb.objectStoreNames.contains(STORE_NAME)){
      idb.deleteObjectStore(STORE_NAME);
    }
    idb.createObjectStore(STORE_NAME, { keyPath: "tote", autoIncrement: false });
  };

  indexedDBOpenRequest.onsuccess = function() {

    console.log('indexedDB OpenRequest onsuccess');
    idbDatabase = indexedDBOpenRequest.result;

    //putToteRequests();

    getToteRequests();
  };
}

function getValueFromDatabase(key,callback) {
  console.log('get From Database ---- ' + key)
  tote_requests.push({"type":"get","key":key,"callback":callback});
  openDatabase();
}


function putValueInDatabase(key, value) {
  console.log('Put In Database ---- ' + key  + "  , " + value )
  var txn = idbDatabase.transaction(STORE_NAME, 'readwrite');
  var objectStore = txn.objectStore(STORE_NAME);
  var request = objectStore.put({'tote':key,'value': value});
  request.onerror = function (e) {
    console.log("Error", e.target.error.name);
  }
  request.onsuccess = function (e) {
    console.log("Woo! Did it");
  }
}

function getToteRequests(){
  for (var j = 0; j < tote_requests.length; j++) {
    var tmp = tote_requests[j];
    console.log("Checking type of request in get Tote Requests = " + tmp.type);

    if (tmp.type == 'get') {
      tote_requests.splice(j,1);
      console.log("In GET");
      var txn = idbDatabase.transaction(["totes"], 'readwrite');
      console.log("^^^^^ " + idbDatabase.objectStoreNames);

      var objectStore = txn.objectStore("totes");
      var r1 = objectStore.get(tmp.key);
      r1.onsuccess = function(e){
        if(e.currentTarget != null && e.currentTarget.result != null){
          var matching = e.currentTarget.result.value;
          console.log("objectstore get key " + matching );
          tmp.callback(matching)
        }else{
          console.log("Object store stor epresent but nothing found, CALLBACK");
          tmp.callback(null);
        }
      }
    }
    r1.onerror = function() {
      console.log("Error");
      tmp.callback(null);
    }

  }
}



//function putToteRequests(){
//  for (var j = 0; j < tote_requests.length; j++) {
//    var tmp = tote_requests[j];
//    console.log("Checking type of request  in putToteRequests = " + tmp.type);
//    if (tmp.type == 'put') {
//      console.log("In PUT");
//      var txn = idbDatabase.transaction(STORE_NAME, 'readwrite');
//      var objectStore = txn.objectStore(STORE_NAME);
//      var request = objectStore.put({'tote':tmp.key,'value': tmp.value});
//      request.onerror = function (e) {
//        console.log("Error", e.target.error.name);
//      }
//      request.onsuccess = function (e) {
//        console.log("Woo! Did it");
//      }
//      tote_requests.splice(j,1);
//    }
//  }
//}



//var request = objectStore.openCursor();
//
//request.onsuccess = function(event) {
//  console.log(request.result + ", " + request.readyState);
//  var cursor = event.target.result;
//  if(cursor){
//    var rec = cursor.value;
//    console.log(rec.key + " --- " + rec.value);
//    cursor.continue();
//  } else{
//
//  }


