let HttpResponseError = require('../httpResponseError.js');

async function validateOrganizationParameters(req) {
  if (!await req.organizations.exists(req.params.orgId)) {
    throw new HttpResponseError('NOT_FOUND', 'Organization not found');
  }

  if (!await req.users.isMemberOf(req.authentication.email, req.params.orgId)) {
    throw new HttpResponseError('UNAUTHORIZED', 'You are not authorized to access that organization');
  }
}

module.exports = function singersController(app) {
  app.get('/organizations/:orgId/singers', async (req, res) => {
    await validateOrganizationParameters(req);

    res.send(await req.singers.findAll(req.params.orgId));
  });

  app.post('/organizations/:orgId/singers', async (req, res) => {
    await validateOrganizationParameters(req);

    req.body.orgId = req.params.orgId;
    let newSingerId = await req.singers.insert(req.body);

    res.status(201).send(await req.singers.find(newSingerId));
  });

  app.delete('/organizations/:orgId/singers/:singerId', async (req, res) => {
    await validateOrganizationParameters(req);

    if (!await req.singers.belongsTo(req.params.singerId, req.params.orgId)) {
      throw new HttpResponseError('BAD_REQUEST', 'That singer is not a member of the organization');
    }

    await req.singers.remove(req.params.singerId);

    res.status(204).send({});
  });
};
