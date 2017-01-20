let express = require('express');

let database = require('./database.js').connect();

let app = express();
app.get('/', async (req, res) => {
  let results = await database.query('SELECT 1 + 1 AS solution');

  res.send(results[0].solution.toString());
});

app.listen(4567, () => console.log('API server listening on port 4567'));
