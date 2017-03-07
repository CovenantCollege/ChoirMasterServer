// eslint-disable-next-line no-unused-vars
module.exports.middleware = function errorHandlingMiddleware(err, req, res, next) {
  res.status(500).send({ error: err.message || 'Unknown error while processing request' });
};

module.exports.wrapAsyncMethods = function (app) {
  for (let method of ['all', 'get', 'post', 'put', 'delete']) {
    let oldRouteMethod = app[method].bind(app);

    app[method] = function (route, handler) {
      oldRouteMethod(route, function (req, res, next) {
        Promise.resolve(handler(req, res, next)).catch(err => next(err));
      });
    };
  }
};
