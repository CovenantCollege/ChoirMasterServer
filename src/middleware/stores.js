let SingerStore = require('../stores/singerStore.js');
let OrganizationStore = require('../stores/organizationStore.js');
let UserStore = require('../stores/userStore.js');

module.exports = function storesMiddleware(request, response, next) {
  request.singers = new SingerStore(request.db);
  request.organizations = new OrganizationStore(request.db);
  request.users = new UserStore(request.db);

  next();
};
