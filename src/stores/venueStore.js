let { ValidationError, NotFoundError } = require('./errors.js');
let Store = require('./store.js');

function validateVenue(venueData) {
  if (venueData.name == null) {
    throw new ValidationError('Venues must have a name');
  }
}

class VenueStore extends Store {
  async find(venueId) {
    let results = await this.database.query('SELECT * FROM Venue WHERE venueId = ?', [venueId]);

    if (results.length == 0) {
      throw new NotFoundError('Venue not found');
    }

    return results[0];
  }

  async findAll(organizationId) {
    return this.database.query('SELECT * FROM Venue WHERE orgId = ?', [organizationId]);
  }

  async insert(venueData) {
    validateVenue(venueData);

    let result = await this.database.query('INSERT INTO Venue (name, orgId) VALUES (?, ?)', [venueData.name, venueData.orgId]);
    return result.insertId;
  }
}

module.exports = VenueStore;
