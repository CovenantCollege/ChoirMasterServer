let authenticationModule = require('../modules/authentication');

module.exports = function authenticationMiddleware(request, response, next) {
  let authorizationHeader = request.headers['authorization'];

  if (authorizationHeader == null) {
    response.status(401).send({ error: 'Authorization header not sent' });
    return;
  }

  let headerParts;
  try {
    headerParts = authorizationHeader.split(' ');
  } catch (e) {
    response.status(400).send({ error: 'Invalid authorization header' });
    return;
  }

  if (headerParts.length != 2) {
    response.status(400).send({ error: 'Invalid authorization header' });
    return;
  }

  if (headerParts[0] != 'jwt') {
    response.status(400).send({ error: 'Invalid authorization header' });
    return;
  }

  let jwtToken = headerParts[1];

  if (!authenticationModule.validate(jwtToken)) {
    response.status(401).send({ error: 'Invalid jwt token' });
    return;
  }

  next();
};
