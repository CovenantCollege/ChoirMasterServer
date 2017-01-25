let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');

let configuration = require('./configuration.js');

let databaseMiddleware = require('./src/middleware/database.js');
let authenticationMiddleware = require('./src/middleware/authentication.js');
let storesMiddleware = require('./src/middleware/stores.js');

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(databaseMiddleware.open);
app.use(storesMiddleware);

require('./src/controllers/sqlDemo.js')(app);
require('./src/controllers/authentication.js')(app);

app.use(authenticationMiddleware);

require('./src/controllers/singers.js')(app);

app.use(databaseMiddleware.close);

app.listen(configuration.server.port, () => console.log('API server listening on port 4567'));
