let HttpResponseError = require('../httpResponseError.js');

async function validateOrganizationParameters(req) {
  if (!await req.organizations.exists(req.params.orgId)) {
    throw new HttpResponseError('NOT_FOUND', 'Organization not found');
  }

  if (!await req.users.isMemberOf(req.authentication.email, req.params.orgId)) {
    throw new HttpResponseError('UNAUTHORIZED', 'You are not authorized to access that organization');
  }
}

async function validateVenueParameters(req) {
  let venue;

  try {
    venue = await req.venues.find(req.params.venueId);
  } catch (e) {
    throw new HttpResponseError('NOT_FOUND', 'Venue not found');
  }

  if (venue.orgId != req.params.orgId) {
    throw new HttpResponseError('BAD_REQUEST', 'Venue does not belong to that organization');
  }
}

async function validatePerformanceParameters(req) {
  try {
    await req.performances.find(req.params.performanceId);
  } catch (e) {
    throw new HttpResponseError('NOT_FOUND', 'Performance not found');
  }

  if (req.params.orgId != (await req.performances.getOrganizationId(req.params.performanceId))) {
    throw new HttpResponseError('BAD_REQUEST', 'Performance does not belong to that organization');
  }

  return true;
}

module.exports = function performancesController(app) {
  app.get('/organizations/:orgId/performances', async (req, res) => {
    await validateOrganizationParameters(req);

    res.status(200).send(await req.performances.findAll(req.params.orgId));
  });

  app.post('/organizations/:orgId/venues/:venueId/performances', async (req, res) => {
    await validateOrganizationParameters(req);
    await validateVenueParameters(req);

    let newPerformanceId = await req.performances.insert(req.body, req.params.venueId);
    res.status(201).send(await req.performances.find(newPerformanceId));
  });

  app.delete('/organizations/:orgId/performances/:performanceId', async (req, res) => {
    await validateOrganizationParameters(req);
    await validatePerformanceParameters(req);

    await req.performances.remove(req.params.performanceId);
    res.status(204).send({});
  });

  app.get('/organizations/:orgId/performances/:performanceId/choirs', async (req, res) => {
    await validateOrganizationParameters(req);
    await validatePerformanceParameters(req);

    let choirIds = await req.performances.getChoirIds(req.params.performanceId);
    res.status(200).send(choirIds);
  });

  app.put('/organizations/:orgId/performances/:performanceId/choirs', async (req, res) => {
    await validateOrganizationParameters(req);
    await validatePerformanceParameters(req);

    if (!Array.isArray(req.body)) {
      throw new HttpResponseError('BAD_REQUEST', 'Expected request body to be an array of choir IDs');
    }

    let performanceOrganization = await req.performances.getOrganizationId(req.params.performanceId);

    for (let choirId of req.body) {
      if (! (await req.choirs.belongsTo(choirId, performanceOrganization))) {
        throw new HttpResponseError('BAD_REQUEST', 'The performance and all choirs must belong to the same organization');
      }
    }

    await req.performances.updateChoirs(req.params.performanceId, req.body);

    res.status(204).send({});
  });
};
