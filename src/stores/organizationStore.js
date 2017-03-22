let { ValidationError, NotFoundError } = require('./errors.js');
let Store = require('./store.js');

function validateOrganization(organizationData) {
  if (organizationData == null || typeof organizationData != 'object') {
    throw new ValidationError('Data for new organization not found');
  }

  if (organizationData.name == null) {
    throw new ValidationError('Organizations must have a name');
  }
}

class OrganizationStore extends Store {
  async find(orgId) {
    let results = await this.database.query('SELECT * from Organizations WHERE orgId = ?', [orgId]);

    if (results.length == 0) {
      throw new NotFoundError('Organization not found');
    }

    return results[0];
  }

  async findAll(userEmail) {
    return this.database.query(`
      SELECT Organizations.orgId, Organizations.name
      FROM Organizations
        INNER JOIN OrganizationMap ON Organizations.orgId = OrganizationMap.orgId
        INNER JOIN Users ON OrganizationMap.userId = Users.userId
      WHERE Users.email  = ?`
    , [userEmail]);
  }

  async insert(userId, organizationData) {
    validateOrganization(organizationData);

    let result = await this.database.query('INSERT INTO Organizations (name) VALUES (?)', [organizationData.name]);
    let organizationId = result.insertId;

    await this.database.query('INSERT INTO OrganizationMap (orgId, userId) VALUES (?, ?)', [organizationId, userId]);

    return organizationId;
  }

  async update(orgId, organizationData) {
    validateOrganization(organizationData);
    await this.database.query('UPDATE Organizations SET name = ? WHERE orgId = ?', [organizationData.name, orgId]);
  }

  async addMember(orgId, userId) {
    await this.database.query('INSERT INTO OrganizationMap (orgId, userId) VALUES (?, ?)', [orgId, userId]);
  }

  async remove(orgId) {
    await this.database.query('DELETE FROM Organizations WHERE orgId = ?', [orgId]);
  }

  async exists(orgId) {
    let result = await this.database.query('SELECT COUNT(*) AS orgCount FROM Organizations WHERE orgId = ?', [orgId]);

    return result[0].orgCount >= 1;
  }
}

module.exports = OrganizationStore;
