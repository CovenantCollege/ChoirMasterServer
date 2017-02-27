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

  if (singerData.orgId == null) {
    throw new Error('Singers must belong to an organization');
  }
}

class SingerStore extends Store {
  async find(singerId) {
    let results = await this.database.query('SELECT * from Singers WHERE singerId = ?', [singerId]);

    if (results.length == 0) {
      throw new Error('Singer not found');
    }

    return results[0];
  }

  async findInChoir(choirId) {
    return await this.database.query(`
      SELECT Singers.*
      FROM Singers INNER JOIN ChoirMap ON Singers.singerId = ChoirMap.singerId
      WHERE ChoirMap.choirId = ?
    `, [choirId]);
  }

  async findAll(organizationId) {
    return this.database.query('SELECT * from Singers WHERE orgId = ?', [organizationId]);
  }

  async insert(singerData) {
    validateSinger(singerData);

    let result = await this.database.query('INSERT INTO Singers (name, height, voice, orgId) VALUES (?, ?, ?, ?)', [singerData.name, singerData.height, singerData.voice, singerData.orgId]);
    return result.insertId;
  }

  async remove(singerId) {
    await this.database.query('DELETE FROM ChoirMap WHERE singerId = ?', [singerId]);
    await this.database.query('DELETE FROM Singers WHERE singerId = ?', [singerId]);
  }

  async update(singerId, singerData) {
    validateSinger(singerData);
    await this.database.query('UPDATE Singers SET name = ?, height = ? WHERE orgId = ?', [singerData.name, singerData.height, singerId]);
  }

  async belongsTo(singerId, organizationId) {
    let result = await this.database.query('SELECT orgId FROM Singers WHERE singerId = ?', [singerId]);

    return result.length > 0 && result[0].orgId == organizationId;
  }
}

module.exports = SingerStore;
