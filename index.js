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

let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let process = require('process');

let configuration = require('./configuration.js');

let errorHandlingMiddleware = require('./src/middleware/errorHandlingMiddleware.js');
let authenticationMiddleware = require('./src/middleware/authentication.js');
let databaseMiddleware = require('./src/middleware/database.js');
let storesMiddleware = require('./src/middleware/stores.js');

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(databaseMiddleware);
app.use(storesMiddleware);

const validators = ['organization', 'performance', 'venue']
  .map(validator => require(`./src/validators/${validator}Parameters.js`));

// Warning: here be dragons.  If you can figure out a better way to handle the
//   two problems documented below, please do so and remove this code.
//
// Basically, express doesn't correctly handle async methods yet.  Whenever an
//   error is thrown within one, it's swallowed silently instead of being made
//   avaliable to the error handling middleware.  Thus we have to monkey patch
//   the express router to correctly add a catch handler to report the errors.
//   Additionally, express doesn't allow middleware to access url paramaters
//   (for obvious reasons, since they aren't defined at the time that middleware
//   is loaded), so we also have to monkey-patch the router to automatically
//   run them at the beginning of each route handler.
for (let method of ['all', 'get', 'post', 'put', 'delete']) {
  let oldRouteMethod = app[method].bind(app);

  app[method] = function (route, handler) {
    oldRouteMethod(route, function (req, res, next) {
      Promise.all(validators.map(validator => validator(req)))
        .then(() => Promise.resolve(handler(req, res, next)).catch(err => next(err)))
        .catch(err => next(err));
    });
  };
}

if (process.env.NO_STATIC_ROOT) {
  app.use(express.static('client/build'));
} else {
  app.use('/choirmaster', express.static('client/build'));
}

require('./src/controllers/sqlDemo.js')(app);
require('./src/controllers/sessions.js')(app);

app.use(authenticationMiddleware);

require('./src/controllers/users.js')(app);
require('./src/controllers/singers.js')(app);
require('./src/controllers/choirs.js')(app);
require('./src/controllers/venues.js')(app);
require('./src/controllers/organizations.js')(app);
require('./src/controllers/performances.js')(app);
require('./src/controllers/grid.js')(app);

app.use(errorHandlingMiddleware);

app.listen(configuration.server.port, () => console.log('API server listening on port 4567'));
