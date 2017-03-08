let HttpResponseError = require('../HttpResponseError.js');

async function validateOrganizationParameters(req) {
  if (!await req.organizations.exists(req.params.orgId)) {
    throw new HttpResponseError('NOT_FOUND', 'Organization not found');
  }

  if (!await req.users.isMemberOf(req.authentication.email, req.params.orgId)) {
    throw new HttpResponseError('UNAUTHORIZED', 'You are not authorized to access that organization');
  }
}

module.exports = function choirsController(app) {
  app.get('/organizations/:orgId/choirs', async (req, res) => {
    await validateOrganizationParameters(req);

    let choirs = await req.choirs.findAll(req.params.orgId);
    res.status(200).send(choirs);
  });

  app.post('/organizations/:orgId/choirs', async (req, res) => {
    await validateOrganizationParameters(req);

    req.body.orgId = req.params.orgId;

    let newChoirId = await req.choirs.insert(req.body);
    res.status(201).send(await req.choirs.find(newChoirId));
  });

  app.get('/organizations/:orgId/choirs/:choirId/singers', async (req, res) => {
    await validateOrganizationParameters(req);

    res.status(200).send(await req.singers.findInChoir(req.params.choirId));
  });

  app.put('/organizations/:orgId/choirs/:choirId/singers', async (req, res) => {
    await validateOrganizationParameters(req);

    let singerIdsInOrganization = (await req.singers.findAll(req.params.orgId)).map(singer => singer.singerId);

    for (let singerId of req.body.singerIds) {
      if (!singerIdsInOrganization.includes(singerId)) {
        throw new HttpResponseError('BAD_REQUEST', "Singer doesn't belong to that organization");
      }
    }

    await req.choirs.updateSingers(req.params.choirId, req.body.singerIds);

    res.status(204).send({});
  });

  app.put('/organizations/:orgId/choirs/:choirId/singers/:singerId', async (req, res) => {
    await validateOrganizationParameters(req);

    await req.choirs.addSinger(req.params.choirId, req.params.singerId);
    res.status(204).send({});
  });

  app.delete('/organizations/:orgId/choirs/:choirId/singers', async (req, res) => {
    await validateOrganizationParameters(req);

    await req.choirs.removeSinger(req.params.choirId, req.params.singerId);
    res.status(204).send({});
  });
};
