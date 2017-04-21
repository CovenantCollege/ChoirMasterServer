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
