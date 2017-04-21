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

let { ValidationError, NotFoundError } = require('./errors.js');
let Store = require('./store.js');

function validateChoir(choirData) {
  if (choirData.name == null) {
    throw new ValidationError('Choirs must have a name');
  }
}

class ChoirStore extends Store {
  async find(choirId) {
    let results = await this.database.query('SELECT * FROM Choirs WHERE choirId = ?', [choirId]);

    if (results.length == 0) {
      throw new NotFoundError('Choir not found');
    }

    return results[0];
  }

  async findAll(organizationId) {
    return this.database.query('SELECT * FROM Choirs WHERE orgId = ?', [organizationId]);
  }

  async insert(choirData) {
    validateChoir(choirData);

    let result = await this.database.query('INSERT INTO Choirs (name, orgId) VALUES (?, ?)', [choirData.name, choirData.orgId]);
    return result.insertId;
  }

  async addSinger(choirId, singerId, validateExistance=true) {
    if (validateExistance) {
      // will throw a NotFoundError if the singer doesn't exist
      await this.database.stores.singers.find(singerId);
    }

    await this.database.query('INSERT INTO ChoirMap (choirId, singerId) VALUES (?, ?)', [choirId, singerId]);
  }

  async removeSinger(choirId, singerId) {
    await this.database.query('DELETE FROM ChoirMap WHERE choirId = ? AND singerId = ?', [choirId, singerId]);
  }

  async getSingerIds(choirId) {
    let results = await this.database.query('SELECT singerId FROM ChoirMap WHERE choirId = ?', [choirId]);
    return results.map(result => result.singerId);
  }

  async updateSingers(choirId, singerIds) {
    let currentSingerIds = await this.getSingerIds(choirId);

    for (let singerIdToAdd of singerIds.filter(id => !currentSingerIds.includes(id))) {
      await this.addSinger(choirId, singerIdToAdd, false);
    }

    for (let singerIdToRemove of currentSingerIds.filter(id => !singerIds.includes(id))) {
      await this.removeSinger(choirId, singerIdToRemove);
    }
  }

  async belongsTo(choirId, organizationId) {
    let result = await this.database.query('SELECT orgId FROM Choirs WHERE choirId = ?', [choirId]);

    return result.length > 0 && result[0].orgId == organizationId;
  }
}

module.exports = ChoirStore;
