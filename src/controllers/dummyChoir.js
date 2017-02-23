/**
 * Returns dummy choir date without authentication
 */
module.exports = function dummyChoirController(app) {
  app.get('/dummy-choir', async (req, res) => {
    res.status(200).send([{ name: 'Marc Bohler', height: 69, voice: 'tenor', id: 123 }, { name: 'Jonathan Austin', height: 72, voice: 'alto', id: 321 }]);
  });
};
