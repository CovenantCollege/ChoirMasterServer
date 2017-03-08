let HttpResponseError = require('../httpResponseError.js');

module.exports = function singersController(app) {
  app.get('/organizations/:orgId/singers', async (req, res) => {
    res.send(await req.singers.findAll(req.params.orgId));
  });

  app.post('/organizations/:orgId/singers', async (req, res) => {
    req.body.orgId = req.params.orgId;
    let newSingerId = await req.singers.insert(req.body);

    res.status(201).send(await req.singers.find(newSingerId));
  });

  app.delete('/organizations/:orgId/singers/:singerId', async (req, res) => {
    if (!await req.singers.belongsTo(req.params.singerId, req.params.orgId)) {
      throw new HttpResponseError('BAD_REQUEST', 'That singer is not a member of the organization');
    }

    await req.singers.remove(req.params.singerId);

    res.status(204).send({});
  });
};
