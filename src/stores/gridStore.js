let { ValidationError/*, NotFoundError*/ } = require('./errors.js');
let Store = require('./store.js');

function validateGrid(grid, maxX, maxY) {
  if (!Array.isArray(grid)) {
    throw new ValidationError('Grid must be an array of grid spots');
  }

  for (let gridSinger of grid) {
    if (!Number.isInteger(gridSinger.x)) {
      throw new ValidationError('Every singer in the grid must have an x coordinate');
    }

    if (!Number.isInteger(gridSinger.y)) {
      throw new ValidationError('Every singer in the grid must have an y coordinate');
    }

    if (gridSinger.x > maxX || gridSinger.y > maxY) {
      throw new ValidationError('Grid contains an out of bounds singer');
    }
  }
}

class GridStore extends Store {
  async find(performanceId) {
    return await this.database.query('SELECT * FROM Grid WHERE performanceId = ?', [performanceId]);
  }

  async update(performanceId, newGrid) {
    validateGrid(newGrid);

    let existingGridQuery = await this.find(performanceId);

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
