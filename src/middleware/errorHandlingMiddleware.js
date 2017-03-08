let HttpResponseError = require('../httpResponseError.js');

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandlingMiddleware(err, req, res, next) {
  if (err instanceof HttpResponseError) {
    res.status(err.errorCode).send({ error: err.message });
  } else {
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
};
