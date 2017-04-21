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

  setStores(stores) {
    this.stores = stores;
  }

  close() {
    this.connection.end();
  }
}

module.exports = Database;
