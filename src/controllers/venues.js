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

module.exports = function venuesController(app) {
  app.get('/organizations/:orgId/venues/', async (req, res) => {
    if (!await validateOrganizationParameters(req, res)) {
      return;
    }

    let venues = await req.venues.findAll(req.params.orgId);
    res.status(200).send(venues);
  });

  app.post('/organizations/:orgId/venues/', async (req, res) => {
    if (!await validateOrganizationParameters(req, res)) {
      return;
    }

    let newVenueId;

    req.body.orgId = req.params.orgId;

    try {
      newVenueId = await req.venues.insert(req.body);
    } catch (e) {
      res.status(400).send({ error: e.message | 'Error creating venue' });
      return;
    }

    res.status(201).send(await req.venues.find(newVenueId));
  });
};
