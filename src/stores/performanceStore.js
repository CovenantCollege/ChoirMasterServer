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

function validatePerformance(performanceData) {
  if (performanceData.description == null) {
    throw new ValidationError('Performance must have a description');
  }

  if (performanceData.date == null) {
    throw new ValidationError('Performance must occur on a date');
  }

  if (!Number.isInteger(performanceData.width)) {
    throw new ValidationError('Performance must have a numerical width');
  }

  if (!Number.isInteger(performanceData.height)) {
    throw new ValidationError('Performance must have a numerical height');
  }
}

class PerformanceStore extends Store {
  async find(performanceId) {
    let results = await this.database.query('SELECT * FROM Performance WHERE performanceId = ?', [performanceId]);

    if (results.length == 0) {
      throw new NotFoundError('Performance not found');
    }

    return results[0];
  }

  async findAll(organizationId) {
    return this.database.query(`
      SELECT Performance.* from Performance
        INNER JOIN Venue ON Performance.venueId = Venue.venueId
      WHERE Venue.orgId = ?
    `, [organizationId]);
  }

  async insert(performanceData, venueId) {
    validatePerformance(performanceData);

    let result = await this.database.query(`
      INSERT INTO Performance (date, description, width, height, venueId) VALUES (?, ?, ?, ?, ?)
    `, [performanceData.date, performanceData.description, performanceData.width, performanceData.height, venueId]);
    return result.insertId;
  }

  async update(performanceId, performanceData) {
    validatePerformance(performanceData);

    let formattedDate = new Date(performanceData.date).toISOString().substring(0, 10);

    await this.database.query(
      'UPDATE Performance SET date = ?, description = ?, width = ?, height = ?',
      [formattedDate, performanceData.description, performanceData.width, performanceData.height]
    );
  }

  async updateSize(performanceId, performanceData) {
    await this.database.query(
      'UPDATE Performance SET width = ?, height = ?',
      [performanceData.width, performanceData.height]
    );
  }

  async addChoir(performanceId, choirId) {
    await this.database.query('INSERT INTO ChoirXPerformance (choirId, performanceId) VALUES (?, ?)', [choirId, performanceId]);
  }

  async removeChoir(performanceId, choirId) {
    await this.database.query('DELETE FROM ChoirXPerformance WHERE performanceId = ? AND choirId = ?', [performanceId, choirId]);
  }

  async removeAllChoirs(performanceId) {
    await this.database.query('DELETE FROM ChoirXPerformance WHERE performanceId = ?', [performanceId]);
  }

  async remove(performanceId) {
    await this.database.query('DELETE FROM Grid WHERE performanceId = ?', [performanceId]);
    await this.database.query('DELETE FROM Performance WHERE performanceId = ?', [performanceId]);

    for (let choirId of await this.getChoirIds(performanceId)) {
      await this.removeChoir(performanceId, choirId);
    }

    // TODO: remove grid once that's implemented
  }

  async getChoirIds(performanceId) {
    let results = await this.database.query('SELECT choirId FROM ChoirXPerformance WHERE performanceId = ?', [performanceId]);

    return results.map(result => result.choirId);
  }

  async updateChoirs(performanceId, choirIds) {
    let currentChoirIds = await this.getChoirIds(performanceId);

    for (let choirToAdd of choirIds.filter(id => !currentChoirIds.includes(id))) {
      await this.addChoir(performanceId, choirToAdd);
    }

    for (let choirToRemove of currentChoirIds.filter(id => !choirIds.includes(id))) {
      await this.removeChoir(performanceId, choirToRemove);
    }
  }


  async getOrganizationId(performanceId) {
    let results = await this.database.query(`
      SELECT Venue.orgId from Venue
        INNER JOIN Performance on Performance.venueId = Venue.venueId
      WHERE Performance.performanceId = ?
    `, [performanceId]);

    if (results.length != 1) {
      throw new Error(`Expcected performance #${performanceId} to belong on one venue`);
    }

    return results[0].orgId;
  }
}

module.exports = PerformanceStore;
