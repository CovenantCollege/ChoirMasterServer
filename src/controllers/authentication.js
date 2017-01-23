let authentication = require('../modules/authentication.js');

module.exports = function authenticationController(app) {
  app.post('/sessions', (req, res) => {
    let token = authentication.signIn(req.body.email, req.body.password);
    let result = token ? 'success' : 'failure';

    res.send({ result, token });
  });
};
