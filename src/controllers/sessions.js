let authentication = require('../modules/authentication.js');

module.exports = function sessionsController(app) {
  app.post('/sessions', async (req, res) => {
    let token = await authentication.signIn(req.body.email, req.body.password, req.users);
    let result = token ? 'success' : 'failure';

    res.send({ result, token });
  });
};
