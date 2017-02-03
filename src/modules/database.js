let configuration = require('../../configuration.js');
let mysql = require('mysql');

class Database {
  constructor(connection) {
    this.connection = connection;
  }

  static connect() {
    return new Promise((resolve, reject) => {
      let connection = mysql.createConnection(configuration.database);

      connection.connect((error) => {
        if (error) {
          console.error("Error: couldn't connect to database.");
          reject(error);
          return;
        }

        resolve(new Database(connection));
      });
    });
  }

  query(queryString, queryValues) {
    return new Promise((resolve, reject) => {
      let callback = (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(results);
      };

      if (queryValues == null) {
        this.connection.query(queryString, callback);
      } else {
        this.connection.query(queryString, queryValues, callback);
      }
    });
  }

  close() {
    this.connection.end();
  }
}

module.exports = Database;
