// let HttpResponseError = require('../httpResponseError.js');

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
};
