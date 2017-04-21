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

let HttpResponseError = require('../httpResponseError.js');

module.exports = function performancesController(app) {
  app.get('/organizations/:orgId/performances', async (req, res) => {
    res.status(200).send(await req.performances.findAll(req.params.orgId));
  });

  app.post('/organizations/:orgId/venues/:venueId/performances', async (req, res) => {
    let newPerformanceId = await req.performances.insert(req.body, req.params.venueId);
    res.status(201).send(await req.performances.find(newPerformanceId));
  });

  app.delete('/organizations/:orgId/performances/:performanceId', async (req, res) => {
    await req.performances.remove(req.params.performanceId);
    res.status(204).send({});
  });

  app.get('/organizations/:orgId/performances/:performanceId/choirs', async (req, res) => {
    let choirIds = await req.performances.getChoirIds(req.params.performanceId);
    res.status(200).send(choirIds);
  });

  app.put('/organizations/:orgId/performances/:performanceId/choirs', async (req, res) => {
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
