module.exports = function singersController(app) {
  app.get('/organizations/:orgId/singers', async (req, res) => {
    if (!await req.organizations.exists(req.params.orgId)) {
      res.status(404).send({ message: 'Organization not found' });
      return;
    }

    if (!await req.users.isMemberOf(req.authentication.email, req.params.orgId)) {
      res.status(403).send({ message: 'You are not authorized to access that organization' });
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
      res.status(400).send({ message: e.message || 'Error creating singer' });
      return;
    }

    res.status(201).send(await req.singers.find(newSingerId));
  });

  app.delete('/organizations/:orgId/singers/:singerId', async (req, res) => {
    if (!await req.organizations.exists(req.params.orgId)) {
      res.status(404).send({ message: 'Organization not found' });
      return;
    }

    if (!await req.users.isMemberOf(req.authentication.email, req.params.orgId)) {
      res.status(401).send({ message: 'You are not authorized to access that organization' });
      return;
    }

    if (!await req.singers.belongsTo(req.params.singerId, req.params.orgId)) {
      res.status(400).send({ message: 'That singer is not a member of the organization' });
    }

    await req.singers.remove(req.params.singerId);

    res.status(204).send({});
  });
};
