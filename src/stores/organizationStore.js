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

function validateOrganization(organizationData) {
  if (organizationData == null || typeof organizationData !== 'object') {
    throw new ValidationError('Data for new organization not found');
  }

  if (organizationData.name == null) {
    throw new ValidationError('Organizations must have a name');
  }
}

class OrganizationStore extends Store {
  async find(orgId) {
    let results = await this.database.query('SELECT * from Organizations WHERE orgId = ?', [orgId]);

    if (results.length === 0) {
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
    for (let venue of await this.database.stores.venues.findAll(orgId)) {
      await this.database.stores.venues.remove(venue.venueId);
    }

    for (let singer of await this.database.stores.singers.findAll(orgId)) {
      await this.database.stores.singers.remove(singer.singerId);
    }

    for (let choir of await this.database.stores.choirs.findAll(orgId)) {
      await this.database.stores.choirs.remove(choir.choirId);
    }

    await this.database.query('DELETE FROM OrganizationMap WHERE orgId = ?', [orgId]);
    await this.database.query('DELETE FROM Organizations WHERE orgId = ?', [orgId]);
  }

  async exists(orgId) {
    let result = await this.database.query('SELECT COUNT(*) AS orgCount FROM Organizations WHERE orgId = ?', [orgId]);

    return result[0].orgCount >= 1;
  }
}

module.exports = OrganizationStore;
