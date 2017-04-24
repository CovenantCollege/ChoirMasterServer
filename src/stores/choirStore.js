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
  async isInPerformance(choirId) {
    let results = await this.database.query('SELECT COUNT(*) as NumPer FROM ChoirXPerformance Where choirId = ?', [choirId]);
    return results[0].NumPer>0;
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

  async remove(choirID) {
    await this.database.query('DELETE FROM ChoirMap WHERE choirId = ?', [choirID]);
    await this.database.query('DELETE FROM ChoirXPerformance WHERE choirId = ?', [choirID]);
    await this.database.query('DELETE FROM Choirs WHERE choirID = ?', [choirID]);
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
