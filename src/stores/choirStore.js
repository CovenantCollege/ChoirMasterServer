let Store = require('./store.js');

function validateChoir(choirData) {
  if (choirData.name == null) {
    throw new Error('Choirs must have a name');
  }
}

class ChoirStore extends Store {
  async find(choirId) {
    let results = await this.database.query('SELECT * FROM Choirs WHERE choirId = ?', [choirId]);

    if (results.length == 0) {
      throw new Error('Choir not found');
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
    if (validateExistance && await this.database.stores.singers.find(singerId) == null) {
      throw new Error('Singer not found');
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
}

module.exports = ChoirStore;
