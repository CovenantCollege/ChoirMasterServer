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

  app.delete('/organizations/:orgId/venues/:venueId', async (req, res) => {
    // if (req.venue.hasPerformance(venueID)){
    //   let results = await this.database.query('SELECT performanceId FROM Performance WHERE venueId = ?' [req.params.venueId]);
    //   for (let resultRow of results){
    //     await this.database.query('DELETE FROM Grid WHERE performanceId = ?' [resultRow.performanceId]);
    //   }
    // }
    await req.venues.remove(req.params.venueId);
    res.status(201).send({});

  });
};
