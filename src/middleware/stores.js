/*
Copyright 2017 David Reed, Joshua Humpherys, and Spencer Dent.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

let SingerStore = require('../stores/singerStore.js');
let OrganizationStore = require('../stores/organizationStore.js');
let UserStore = require('../stores/userStore.js');
let ChoirStore = require('../stores/choirStore.js');
let VenueStore = require('../stores/venueStore.js');
let PerformanceStore = require('../stores/performanceStore.js');
let GridStore = require('../stores/gridStore.js');

module.exports = function storesMiddleware(request, response, next) {
  let stores = {
    singers: new SingerStore(request.db),
    organizations: new OrganizationStore(request.db),
    users: new UserStore(request.db),
    choirs: new ChoirStore(request.db),
    venues: new VenueStore(request.db),
    performances: new PerformanceStore(request.db),
    grid: new GridStore(request.db),
  };

  Object.assign(request, stores);
  request.db.setStores(stores);

  next();
};
