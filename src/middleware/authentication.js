/*
Copyright 2017 David Reed, Joshua Humpherys, and Spencer Dent.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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

  let validationResult = authenticationModule.validate(jwtToken);
  if (!validationResult) {
    response.status(401).send({ error: 'Invalid jwt token' });
    return;
  }

  if (validationResult.signedIn !== true) {
    response.status(401).send({ error: 'You are not signed in' });
    return;
  }

  request.authentication = validationResult;
  next();
};
