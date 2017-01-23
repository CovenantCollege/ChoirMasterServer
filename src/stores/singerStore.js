// TODO: replace with real database
let singerId = 0;
let singersDatabase = [];

function validateSinger(singerData) {
  if (singerData == null || typeof singerData != 'object') {
    throw new Error('Data for new singer not found');
  }

  // TODO: validate fields
}

function find(singerId) {
  for (let singer of singersDatabase) {
    if (singer.id === singerId) {
      return singer;
    }
  }

  throw new Error('Singer not found');
}

function findAll() {
  return singersDatabase;
}

function insert(singerData) {
  validateSinger(singerData);

  singerData.id = singerId++;
  singersDatabase.push(singerData);

  return singerData;
}

function findIndex(singerId) {
  let indexOfSinger = singersDatabase.findIndex(singer => singer.id == singerId);
  if (indexOfSinger === -1) {
    throw new Error('Singer not found');
  }

  return indexOfSinger;
}

function update(singerId, newFields) {
  validateSinger(newFields);

  newFields.id = singerId;
  singersDatabase.splice(findIndex(singerId), 1, newFields);
}

function remove(singerId) {
  singersDatabase.splice(findIndex(singerId), 1);
}

module.exports = { find, findAll, insert, update, remove };
