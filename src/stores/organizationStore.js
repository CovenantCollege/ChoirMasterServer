module.exports = function organizationStore(db) {
  function validateOrganization(organizationData) {
    if (organizationData == null || typeof organizationData != 'object') {
      throw new Error('Data for new organization not found');
    }

    if (Organization.name == null) {
      throw new Error('Organizations must have a name');
    }
  }

  async function find(orgId) {
    let results = await db.query('SELECT * from organizations WHERE id = ?', [orgId]);

    if (results.length == 0) {
      throw new Error('Organization not found');
    }

    return results[0];
  }

  async function findAll() {
    return db.query('SELECT * from organizations');
  }

  async function insert(organizationData) {
    validateSinger(organizationData);

    let result = await db.query('INSERT INTO organizations (name) VALUES (?)', [organizationData.name]);
    return result.insertId;
  }

  async function update(orgId, organizationData) {
    validateOrganization(organizationData);
    await db.query('UPDATE organizations SET name = ? WHERE ID = ?', [organizationData.name, orgId]);
  }

  async function remove(orgId) {
    await db.query('DELETE FROM organizations WHERE id = ?', [orgId]);
  }

  return { find, findAll, insert, update, remove };
};
