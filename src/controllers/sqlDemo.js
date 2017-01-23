module.exports = function sqlDemoController(app, database) {
  app.get('/', async (req, res) => {
    let results = await database.query('SELECT 1 + 1 AS solution');

    res.send(results[0].solution.toString());
  });
};
