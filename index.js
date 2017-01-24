let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let database = require('./src/modules/database.js').connect();
let authenticationMiddleware = require('./src/middleware/authentication.js');

let app = express();
app.use(cors());
app.use(bodyParser.json());

require('./src/controllers/sqlDemo.js')(app, database);
require('./src/controllers/authentication.js')(app, database);

app.use(authenticationMiddleware);

require('./src/controllers/singers.js')(app, database);

app.listen(4567, () => console.log('API server listening on port 4567'));
