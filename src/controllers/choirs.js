async function validateOrganizationParameters(req, res) {
  if (!await req.organizations.exists(req.params.orgId)) {
    res.status(404).send({ error: 'Organization not found' });
    return false;
  }

  if (!await req.users.isMemberOf(req.authentication.email, req.params.orgId)) {
    res.status(403).send({ error: 'You are not authorized to access that organization' });
    return false;
  }

  return true;
}

module.exports = function choirsController(app) {
  app.get('/organizations/:orgId/choirs', async (req, res) => {
    if (!await validateOrganizationParameters(req, res)) {
      return;
    }

    let choirs = await req.choirs.findAll(req.params.orgId);
    res.status(200).send(choirs);
  });

  app.post('/organizations/:orgId/choirs', async (req, res) => {
    if (!await validateOrganizationParameters(req, res)) {
      return;
    }

    let newChoirId;

    req.body.orgId = req.params.orgId;

    try {
      newChoirId = await req.choirs.insert(req.body);
    } catch (e) {
      res.status(400).send({ error: e.message | 'Error creating choir' });
      return;
    }

    res.status(201).send(await req.choirs.find(newChoirId));
  });

  app.get('/organizations/:orgId/choirs/:choirId/singers', async (req, res) => {
    if (!await validateOrganizationParameters(req, res)) {
      return;
    }

    res.status(200).send(await req.singers.findInChoir(req.params.choirId));
  });

  app.put('/organizations/:orgId/choirs/:choirId/singers/:singerId', async (req, res) => {
    if (!await validateOrganizationParameters(req, res)) {
      return;
    }

    await req.choirs.addSinger(req.params.choirId, req.params.singerId);
    res.status(204).send({});
  });

  app.delete('/organizations/:orgId/choirs/:choirId/singers', async (req, res) => {
    if (!await validateOrganizationParameters(req, res)) {
      return;
    }

    await req.choirs.removeSinger(req.params.choirId, req.params.singerId);
    res.status(204).send({});
  });
};
