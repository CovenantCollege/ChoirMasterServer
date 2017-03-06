let SingerStore = require('../stores/singerStore.js');
let OrganizationStore = require('../stores/organizationStore.js');
let UserStore = require('../stores/userStore.js');
let ChoirStore = require('../stores/choirStore.js');
let VenueStore = require('../stores/venueStore.js');
let PerformanceStore = require('../stores/performanceStore.js');

module.exports = function storesMiddleware(request, response, next) {
  let stores = {
    singers: new SingerStore(request.db),
    organizations: new OrganizationStore(request.db),
    users: new UserStore(request.db),
    choirs: new ChoirStore(request.db),
    venues: new VenueStore(request.db),
    performances: new PerformanceStore(request.db)
  };

  Object.assign(request, stores);
  request.db.setStores(stores);

  next();
};
