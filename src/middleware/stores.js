let SingerStore = require('../stores/singerStore.js');
let OrganizationStore = require('../stores/organizationStore.js');

module.exports = function storesMiddleware(request, response, next) {
  request.singers = new SingerStore(request.db);
  request.organizations = new OrganizationStore(request.db);

  next();
};
