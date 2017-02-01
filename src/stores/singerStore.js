let Store = require('./store.js');

function validateSinger(singerData) {
  if (singerData == null || typeof singerData != 'object') {
    throw new Error('Data for new singer not found');
  }

  if (singerData.name == null) {
    throw new Error('Singers must have a name');
  }

  if (singerData.height == null) {
    throw new Error('Singers must hava a height');
  }
}

class SingerStore extends Store {
  async find(singerId) {
    let results = await this.database.query('SELECT * from Singers WHERE orgId = ?', [singerId]);

    if (results.length == 0) {
      throw new Error('Singer not found');
    }

    return results[0];
  }

  async findAll(organizationData) {
    return this.database.query('SELECT * from Singers WHERE orgId = ?', [organizationData.orgId]);
  }

  async insert(singerData) {
    validateSinger(singerData);

    let result = await this.database.query('INSERT INTO Singers (name, height, orgId) VALUES (?, ?, ?)', [singerData.name, singerData.height, singerData.orgId]);
    return result.insertId;
  }

  async update(singerId, singerData) {
    validateSinger(singerData);
    await this.database.query('UPDATE Singers SET name = ?, height = ? WHERE orgId = ?', [singerData.name, singerData.height, singerId]);
  }

  async remove(singerId) {
    await this.database.query('DELETE FROM Singers WHERE orgId = ?', [singerId]);
  }
}

module.exports = SingerStore;
