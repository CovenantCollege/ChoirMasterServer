let HttpResponseError = require('../httpResponseError.js');

class ValidationError extends HttpResponseError {
  constructor(message) {
    super(HttpResponseError.BAD_REQUEST, message);
  }
}

class NotFoundError extends HttpResponseError {
  constructor(message) {
    super(HttpResponseError.NOT_FOUND, message);
  }
}

module.exports = { ValidationError, NotFoundError };
