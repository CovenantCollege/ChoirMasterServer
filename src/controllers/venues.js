let HttpResponseError = require('../httpResponseError.js');

async function validateOrganizationParameters(req) {
  if (!await req.organizations.exists(req.params.orgId)) {
    throw new HttpResponseError('NOT_FOUND', 'Organization not found');
  }

  if (!await req.users.isMemberOf(req.authentication.email, req.params.orgId)) {
    throw new HttpResponseError('UNAUTHORIZED', 'You are not authorized to access that organization');
  }
}

module.exports = function venuesController(app) {
  app.get('/organizations/:orgId/venues/', async (req, res) => {
    await validateOrganizationParameters(req);

    let venues = await req.venues.findAll(req.params.orgId);
    res.status(200).send(venues);
  });

  app.post('/organizations/:orgId/venues/', async (req, res) => {
    await validateOrganizationParameters(req, res);

    req.body.orgId = req.params.orgId;

    let newVenueId = await req.venues.insert(req.body);
    res.status(201).send(await req.venues.find(newVenueId));
  });
};
