let configuration = require('../../configuration.js');
let jwt = require('jsonwebtoken');

function signIn(email, password) {
  // TODO: actually validate the user's credentials
  if (password != 'password') {
    return false;
  }

  return jwt.sign({ email, signedIn: true }, configuration.authentication.encryptionKey);
}

function validate(jwtToken) {
  try {
    let decodedToken = jwt.verify(jwtToken, configuration.authentication.encryptionKey);
    return decodedToken.signedIn === true;
  } catch (e) {
    return false;
  }
}


module.exports = { signIn, validate };
