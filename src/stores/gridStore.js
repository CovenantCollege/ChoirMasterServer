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

let { ValidationError/*, NotFoundError*/ } = require('./errors.js');
let Store = require('./store.js');

function validateGrid(grid) {
  if (!Array.isArray(grid)) {
    throw new ValidationError('Grid must be an array of grid spots');
  }

  for (let gridSquare of grid) {
    if (!Number.isInteger(gridSquare.x)) {
      throw new ValidationError('Every square in the grid must have an x coordinate');
    }

    if (!Number.isInteger(gridSquare.y)) {
      throw new ValidationError('Every square in the grid must have an y coordinate');
    }
  }
}

class GridStore extends Store {
  async find(performanceId) {
    return await this.database.query('SELECT x, y FROM E_Grid WHERE performanceId = ? AND ENABLED = 1', [performanceId]);
  }

  async update(performanceId, newGrid) {
    validateGrid(newGrid);

    let existingGrid = await this.find(performanceId);

    let spotsToDisable = existingGrid.filter(oldSpot => {
      for (let newSpot of newGrid) {
        if (newSpot.x === oldSpot.x && newSpot.y === oldSpot.y) {
          return false;
        }
      }

      return true;
    });

    let spotsToEnable = newGrid.filter(newSpot => {
      for (let oldSpot of existingGrid) {
        if (oldSpot.x === newSpot.x && oldSpot.y === newSpot.y) {
          return false;
        }
      }

      return true;
    });

    for (let { x, y } of spotsToDisable) {
      console.log("Disabling " + x + ", " + y);
      await this.disableSpot(performanceId, x, y);
    }

    for (let { x, y } of spotsToEnable) {
      console.log("Enabling " + x + ", " + y);
      await this.enableSpot(performanceId, x, y);
    }
  }

  async findSingers(performanceId) {
    return await this.database.query('SELECT * FROM Grid WHERE performanceId = ?', [performanceId]);
  }

  async updateSingers(performanceId, newGrid) {
    validateGrid(newGrid);

    let existingGridQuery = await this.findSingers(performanceId);

    let singersInOldGrid = existingGridQuery.map(g => g.singerId);
    let singersInNewGrid = newGrid.map(g => g.singerId);

    let singersToAdd = singersInNewGrid.filter(id => !singersInOldGrid.includes(id));
    let singersToUpdate = [];
    let singersToRemove = [];

    for (let oldSingerId of singersInOldGrid) {
      if (singersInNewGrid.includes(oldSingerId)) {
        singersToUpdate.add(oldSingerId);
      } else {
        singersToRemove.add(oldSingerId);
      }
    }

    for (let singerIdToAdd of singersToAdd) {
      let singer = singersInNewGrid.find(s => s.id == singerIdToAdd);
      await this.addSinger(performanceId, singerIdToAdd, singer.x, singer.y);
    }

    for (let singerIdToRemove of singersToRemove) {
      await this.removeSinger(performanceId, singerIdToRemove);
    }

    for (let singerIdToUpdate of singersToUpdate) {
      let newSinger = singersInNewGrid.find(s => s.id == singerIdToUpdate);
      await this.updateSinger(performanceId, singerIdToUpdate, newSinger.x, newSinger.y);
    }
  }

  async enableSpot(performanceId, x, y) {
    await this.database.query(
      'INSERT INTO E_Grid (performanceId, x, y, enabled) VALUES (?, ?, ?, 1)',
      [performanceId, x, y]
    );
  }

  async disableSpot(performanceId, x, y) {
    await this.database.query(
      'DELETE FROM E_Grid WHERE performanceId = ? AND x = ? AND y = ?',
      [performanceId, x, y]
    );
  }

  async addSinger(performanceId, singerId, x, y) {
    await this.database.query(
      'INSERT INTO Grid (singerId, performanceId, x, y) VALUES (?, ?, ?, ?)',
      [singerId, performanceId, x, y]
    );
  }

  async updateSinger(performanceId, singerId, x, y) {
    await this.database.query(
      'UPDATE Grid (x, y) SET x = ?, y = ? WHERE performanceId = ? AND singerId = ?',
      [x, y, performanceId, singerId]
    );
  }

  async removeSinger(performanceId, singerId) {
    await this.database.query(
      'DELETE FROM Grid WHERE performanceId = ? AND singerId = ?',
      [performanceId, singerId]
    );
  }
}

module.exports = GridStore;

//
//
// const updateQuery = `
//   IF (SELECT COUNT(*) FROM Grid WHERE performanceId = ? AND singerId = ?) >= 1 THEN
//     UPDATE Grid (x, y) SET x = ?, y = ? WHERE performanceId = ? AND singerId = ?;
//   ELSE
//     INSERT INTO Grid (singerId, performanceId, x, y) VALUES (?, ?, ?, ?)
//   END IF;
// `;
//
// const params = [performanceId, singerId, x, y, performanceId, singerId, singerId, performanceId, x, y];
//
//
// await this.database.query(
//   `
//     IF (SELECT COUNT(*) FROM Grid WHERE performanceId = ? AND singerId = ?) >= 1 THEN
//       UPDATE Grid (x, y) SET x = ?, y = ? WHERE performanceId = ? AND singerId = ?;
//     ELSE
//       INSERT INTO Grid (singerId, performanceId, x, y) VALUES (?, ?, ?, ?)
//     END IF;
//   `
//   , [performanceId, singerId, x, y, performanceId, singerId, singerId, performanceId, x, y]
// );
