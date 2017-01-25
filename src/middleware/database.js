let Database = require('../modules/database.js');

module.exports = {
  open: function (request, response, next) {
    Database.connect().then(connection => {
      request.db = connection;

      next();
    });
  },

  close: function (request, response, next) {
    request.db.close();
    next();
  }
};
