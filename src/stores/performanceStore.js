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

  async remove(performanceId) {
    await this.database.query('DELETE FROM Performance WHERE performanceId = ?', [performanceId]);

    // TODO: remove grid once that's implemented
  }
}

module.exports = PerformanceStore;
