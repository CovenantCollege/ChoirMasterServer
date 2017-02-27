let Database = require('../modules/database.js');

module.exports = function (request, response, next) {
  Database.connect().then(connection => {
    request.db = connection;

    request.on('end', () => {
      request.db.close();
    });

    next();
  });
};
