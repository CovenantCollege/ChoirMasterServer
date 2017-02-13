module.exports = function singersController(app) {
  app.get('/organizations/:orgId/singers', async (req, res) => {
    if (!await req.organizations.exists(req.params.orgId)) {
      res.status(404).send({ error: 'Organization not found' });
      return;
    }

    if (!await req.users.isMemberOf(req.authentication.email, req.params.orgId)) {
      res.status(403).send({ error: 'You are not authorized to access that organization' });
      return;
    }

    res.send(await req.singers.findAll(req.params.orgId));
  });

  app.post('/organizations/:orgId/singers', async (req, res) => {
    let newSingerId;

    req.body.orgId = req.params.orgId;

    try {
      newSingerId = await req.singers.insert(req.body);
    } catch (e) {
      res.status(400).send({ error: e.message || 'Error creating singer' });
      return;
    }

    res.status(201).send(await req.singers.find(newSingerId));
  });
};
