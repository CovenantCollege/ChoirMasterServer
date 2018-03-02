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

    let result = await this.database.query(
      'INSERT INTO Venue (name, orgId, description, width, height) VALUES (?, ?, \'\', 0, 0)',
      [venueData.name, venueData.orgId]
    );

    return result.insertId;
  }

  async hasPerformance(venueId) {
    let results = await this.database.query('SELECT COUNT(*) as NumPer FROM Performance WHERE venueId = ?', [venueId]);
    return results[0].NumPer>0;
  }

  async remove(venueId) {
    if (this.hasPerformance(venueId)) {
      let results = await this.database.query('SELECT performanceId FROM Performance WHERE venueId = ?', [venueId]);
      for (let resultRow of results) {
        await this.database.performances.remove(resultRow.performanceId);
      }
    }
    await this.database.query('DELETE FROM Venue WHERE venueId = ?', [venueId]);
  }
}

module.exports = VenueStore;
