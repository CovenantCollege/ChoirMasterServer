module.exports = function sqlDemoController(app) {
  app.get('/', async (req, res) => {
    let results = await req.db.query('SELECT 1 + 1 AS solution');

    res.send(results[0].solution.toString());
  });
};
