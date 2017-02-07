let authentication = require('../modules/authentication.js');

module.exports = function sessionsController(app) {
  app.post('/sessions', async (req, res) => {
    let token = await authentication.signIn(req.body.email, req.body.password, req.users);

    if (token) {
      res.status(200).send({ result: 'success', token });
    } else {
      res.status(403).send({ result: 'failure' });
    }
  });
};
