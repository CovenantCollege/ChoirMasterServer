let Store = require('./store.js');

function validatePerformance(performanceData) {
  if (performanceData.description == null) {
    throw new Error('Performance must have a description');
  }

  if (performanceData.date == null) {
    throw new Error('Performance must occur on a date');
  }
}

class PerformanceStore extends Store {
  async find(performanceId) {
    let results = await this.database.query('SELECT * FROM Performance WHERE performanceId = ?', [performanceId]);

    if (results.length == 0) {
      throw new Error('Performance not found');
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
      INSERT INTO Performance (date, description, venueId) VALUES (?, ?, ?)
    `, [performanceData.date, performanceData.description, venueId]);
    return result.insertId;
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
