module.exports = function venuesController(app) {
  app.get('/organizations/:orgId/venues/', async (req, res) => {
    let venues = await req.venues.findAll(req.params.orgId);
    res.status(200).send(venues);
  });

  app.post('/organizations/:orgId/venues/', async (req, res) => {
    req.body.orgId = req.params.orgId;

    let newVenueId = await req.venues.insert(req.body);
    res.status(201).send(await req.venues.find(newVenueId));
  });
};
