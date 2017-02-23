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

if (process.env.NO_STATIC_ROOT) {
  app.use(express.static('client/build'));
} else {
  app.use('/choirmaster', express.static('client/build'));
}

app.use(errorHandlingMiddleware);
app.use(databaseMiddleware.open);
app.use(storesMiddleware);

require('./src/controllers/sqlDemo.js')(app);
require('./src/controllers/sessions.js')(app);
require('./src/controllers/dummyChoir.js')(app);

app.use(authenticationMiddleware);

require('./src/controllers/users.js')(app);
require('./src/controllers/singers.js')(app);
require('./src/controllers/organizations.js')(app);

app.use(databaseMiddleware.close);

app.listen(configuration.server.port, () => console.log('API server listening on port 4567'));
