let HttpResponseError = require('../httpResponseError.js');

// eslint-disable-next-line no-unused-vars
module.exports.middleware = function errorHandlingMiddleware(err, req, res, next) {
  if (err instanceof HttpResponseError) {
    res.status(err.errorCode).send({ error: err.message });
  } else {
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
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
