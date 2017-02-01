module.exports = function singerStore(db) {
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

  async function find(singerId) {
    let results = await db.query('SELECT * from Singers WHERE orgId = ?', [singerId]);

    if (results.length == 0) {
      throw new Error('Singer not found');
    }

    return results[0];
  }

  async function findAll(organizationData) {
    return db.query('SELECT * from Singers WHERE orgId = ?', [organizationData.orgId]);
  }

  async function insert(singerData) {
    validateSinger(singerData);

    let result = await db.query('INSERT INTO Singers (name, height, orgId) VALUES (?, ?, ?)', [singerData.name, singerData.height, singerData.orgId]);
    return result.insertId;
  }

  async function update(singerId, singerData) {
    validateSinger(singerData);
    await db.query('UPDATE Singers SET name = ?, height = ? WHERE orgId = ?', [singerData.name, singerData.height, singerId]);
  }

  async function remove(singerId) {
    await db.query('DELETE FROM Singers WHERE orgId = ?', [singerId]);
  }

  return { find, findAll, insert, update, remove };
};
