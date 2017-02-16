let SingerStore = require('../stores/singerStore.js');
let OrganizationStore = require('../stores/organizationStore.js');
let UserStore = require('../stores/userStore.js');
let ChoirStore = require('../stores/choirStore.js');

module.exports = function storesMiddleware(request, response, next) {
  let stores = {
    singers: new SingerStore(request.db),
    organizations: new OrganizationStore(request.db),
    users: new UserStore(request.db),
    choirs: new ChoirStore(request.db)
  };

  request.db.setStores(stores);
  Object.assign(request, stores);

  next();
};
