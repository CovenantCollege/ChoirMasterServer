module.exports = function singersController(app) {
  app.get('/singers', async (req, res) => {
    res.send(await req.singers.findAll());
  });

  app.post('/singers', async (req, res) => {
    let newSingerId;

    try {
      newSingerId = await req.singers.insert(req.body);
    } catch (e) {
      res.status(400).send({ error: e.message || 'Error creating singer' });
      return;
    }

    res.status(201).send(await req.singers.find(newSingerId));
  });
};
