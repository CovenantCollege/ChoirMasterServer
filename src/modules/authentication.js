let configuration = require('../../configuration.js');
let jwt = require('jsonwebtoken');

async function signIn(email, password, userStore) {
  if (!await userStore.checkPassword(email, password)) {
    return false;
  }

  return jwt.sign({ email, signedIn: true }, configuration.authentication.encryptionKey);
}

function validate(jwtToken) {
  try {
    return jwt.verify(jwtToken, configuration.authentication.encryptionKey);
  } catch (e) {
    return false;
  }
}


module.exports = { signIn, validate };
