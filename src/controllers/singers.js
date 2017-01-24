module.exports = function singersController(app, db) {
  let singerStore = require('../stores/singerStore.js')(db);

  app.get('/singers', async (req, res) => {
    res.send(await singerStore.findAll());
  });

  app.post('/singers', async (req, res) => {
    let newSingerId;
    
    try {
      newSingerId = await singerStore.insert(req.body);
    } catch (e) {
      res.status(400).send({ error: e.message || 'Error creating singer' });
      return;
    }

    res.status(201).send(await singerStore.find(newSingerId));
  });
};
