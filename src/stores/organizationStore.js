let Store = require('./store.js');

function validateOrganization(organizationData) {
  if (organizationData == null || typeof organizationData != 'object') {
    throw new Error('Data for new organization not found');
  }

  if (organizationData.name == null) {
    throw new Error('Organizations must have a name');
  }
}

class OrganizationStore extends Store {
  async find(orgId) {
    let results = await this.database.query('SELECT * from organizations WHERE id = ?', [orgId]);

    if (results.length == 0) {
      throw new Error('Organization not found');
    }

    return results[0];
  }

  async findAll() {
    return this.database.query('SELECT * from organizations');
  }

  async insert(organizationData) {
    validateOrganization(organizationData);

    let result = await this.database.query('INSERT INTO organizations (name) VALUES (?)', [organizationData.name]);
    return result.insertId;
  }

  async update(orgId, organizationData) {
    validateOrganization(organizationData);
    await this.database.query('UPDATE organizations SET name = ? WHERE ID = ?', [organizationData.name, orgId]);
  }

  async remove(orgId) {
    await this.database.query('DELETE FROM organizations WHERE id = ?', [orgId]);
  }
}

module.exports = OrganizationStore;
