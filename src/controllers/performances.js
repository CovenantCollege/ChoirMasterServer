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

async function validateVenueParameters(req, res) {
  let venue;

  try {
    venue = await req.venues.find(req.params.venueId);
  } catch (e) {
    res.status(404).send({ error: 'Venue not found' });
    return false;
  }

  if (venue.orgId != req.params.orgId) {
    res.status(400).send({ error: 'Venue does not belong to that organization' });
    return false;
  }

  return true;
}

async function validatePerformanceParameters(req, res) {
  try {
    await req.performances.find(req.params.performanceId);
  } catch (e) {
    res.status(404).send({ error: 'Performance not found' });
    return false;
  }

  if (req.params.orgId != (await req.performances.getOrganizationId(req.params.performanceId))) {
    res.status(400).send({ error: 'Performance does not belong to that organization' });
    return false;
  }

  return true;
}

module.exports = function performancesController(app) {
  app.get('/organizations/:orgId/performances', async (req, res) => {
    if (!await validateOrganizationParameters(req, res)) {
      return;
    }

    res.status(200).send(await req.performances.findAll(req.params.orgId));
  });

  app.post('/organizations/:orgId/venues/:venueId/performances', async (req, res) => {
    if (!await validateOrganizationParameters(req, res)) {
      return;
    }

    if (!await validateVenueParameters(req, res)) {
      return;
    }

    let newPerformanceId;

    try {
      newPerformanceId = await req.performances.insert(req.body, req.params.venueId);
    } catch (e) {
      res.status(400).send(e.message | 'Unknown error creating performance');
      return;
    }

    res.status(201).send(await req.performances.find(newPerformanceId));
  });

  app.delete('/organizations/:orgId/performances/:performanceId', async (req, res) => {
    if (!await validateOrganizationParameters(req, res)) {
      return;
    }

    if (!await validatePerformanceParameters(req, res)) {
      return;
    }

    await req.performances.remove(req.params.performanceId);
    res.status(204).send({});
  });

  app.get('/organizations/:orgId/performances/:performanceId/choirs', async (req, res) => {
    if (!await validateOrganizationParameters(req, res)) {
      return;
    }

    if (!await validatePerformanceParameters(req, res)) {
      return;
    }

    let choirIds = await req.performances.getChoirIds(req.params.performanceId);
    res.status(200).send(choirIds);
  });

  app.put('/organizations/:orgId/performances/:performanceId/choirs', async (req, res) => {
    if (!await validateOrganizationParameters(req, res)) {
      return;
    }

    if (!await validatePerformanceParameters(req, res)) {
      return;
    }

    if (!Array.isArray(req.body)) {
      res.status(404).send({ error: 'Expected request body to be an array of choir IDs' });
      return;
    }

    let performanceOrganization = await req.performances.getOrganizationId(req.params.performanceId);

    for (let choirId of req.body) {
      if (! (await req.choirs.belongsTo(choirId, performanceOrganization))) {
        res.status(400).send({ error: 'The performance and all choirs must belong to the same organization' });
        return;
      }
    }

    await req.performances.updateChoirs(req.params.performanceId, req.body);

    res.status(204).send({});
  });
};