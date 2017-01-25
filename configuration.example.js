let process = require('process');

module.exports = {
  'database': {
    'host': 'localhost',
    'user': 'choirmaster',
    'password': 'choirmaster',
    'database': 'choirmaster'
  },

  'authentication': {
    'encryptionKey': 'changethisatonce'
  }
};

if (process.env.HEROKU) {
  module.exports.database = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  };
}
