/*
Copyright 2017 David Reed, Joshua Humpherys, and Spencer Dent.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
