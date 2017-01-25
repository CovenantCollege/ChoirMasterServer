let configuration = require('../../configuration.js');
let mysql = require('mysql');

class Database {
  constructor(connection) {
    this.connection = connection;
  }

  static async connect() {
    let connection = mysql.createConnection(configuration.database);

    connection.connect((error) => {
      if (error) {
        console.error("Error: couldn't connect to database.");
        throw error;
      }
    });

    return new Database(connection);
  }

  async query(queryString, queryValues) {
    return new Promise((resolve, reject) => {
      let callback = (error, results) => {
        if (error) {
          reject(error);
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
