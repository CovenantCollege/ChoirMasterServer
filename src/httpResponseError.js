// TODO: add other error codes as necessary
const errorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501
};

class HttpResponseError extends Error {
  constructor(errorCode, message) {
    super(message);

    this._errorCode = errorCode;
  }

  get errorCode() {
    if (typeof this._errorCode === 'string' && errorCodes.hasOwnProperty(this._errorCode)) {
      return errorCodes[this._errorCode];
    } else if (Number.isInteger(this._errorCode) && this._errorCode >= 400 && this._errorCode <= 511) {
      return this._errorCode;
    } else {
      return 500;
    }
  }
}

Object.assign(HttpResponseError, errorCodes);
module.exports = HttpResponseError;
