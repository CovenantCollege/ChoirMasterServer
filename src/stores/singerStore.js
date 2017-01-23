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
    let results = await db.query('SELECT * from singers WHERE id = ?', [singerId]);

    if (results.length == 0) {
      throw new Error('Singer not found');
    }

    return results[0];
  }

  async function findAll() {
    return db.query('SELECT * from singers');
  }

  async function insert(singerData) {
    validateSinger(singerData);

    let result = await db.query('INSERT INTO singers (name, height) VALUES (?, ?)', [singerData.name, singerData.height]);
    return result.insertId;
  }

  async function update(singerId, singerData) {
    validateSinger(singerData);
    await db.query('UPDATE singers SET name = ?, height = ? WHERE ID = ?', [singerData.name, singerData.height, singerId]);
  }

  async function remove(singerId) {
    await db.query('DELETE FROM singers WHERE id = ?', [singerId]);
  }

  return { find, findAll, insert, update, remove };
};
