let singerStoreFactory = require('../stores/singerStore.js');

module.exports = function storesMiddleware(request, response, next) {
  request.singers = singerStoreFactory(request.db);

  next();
};
