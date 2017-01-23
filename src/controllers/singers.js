let singerStore = require('../stores/singerStore.js');

module.exports = function singersController(app) {
  app.get('/singers', (req, res) => {
    res.send(singerStore.findAll());
  });

  app.post('/singers', (req, res) => {
    let newSinger = req.body;

    try {
      newSinger = singerStore.insert(newSinger);
    } catch (e) {
      res.status(400).send({ error: e.message || 'Error creating singer' });
      return;
    }

    res.status(201).send(newSinger);
  });
};
