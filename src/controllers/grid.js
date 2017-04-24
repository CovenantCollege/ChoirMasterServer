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

module.exports = function gridController(app) {
  app.get('/organizations/:orgId/performances/:performanceId/grid', async (req, res) => {
    let grid = await req.grid.find(req.params.performanceId);
    res.status(200).send(grid);
  });

  app.put('/organizations/:orgId/performances/:performanceId/grid', async (req, res) => {
    await req.grid.update(req.params.performanceId, req.body);

    res.status(204).send({});
  });

  app.get('/organizations/:orgId/performances/:performanceId/grid/singers', async (req, res) => {
    let grid = await req.grid.findSingers(req.params.performanceId);
    res.status(200).send(grid);
  });

  app.put('/organizations/:orgId/performances/:performanceId/grid/singers', async (req, res) => {
    await req.grid.updateSingers(req.params.performanceId, req.body);

    res.status(204).send({});
  });

  app.get('/organizations/:orgId/performances/:performanceId/grid/singers/algorithm', async (req, res) => {
    let grid = await req.grid.arrangeSingers(req.params.orgId, req.params.performanceId);
    res.status(200).send(grid);
  });
};
