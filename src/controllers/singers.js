// TODO: replace with real database
let singerId = 0;
let singersDatabase = [];

module.exports = function singersController(app) {
  app.get('/singers', (req, res) => {
    res.send(singersDatabase);
  });

  app.post('/singers', (req, res) => {
    let newSinger = req.body;

    if (newSinger == null || typeof newSinger != 'object') {
      res.status(400).send({ error: 'Data for new singer not found' });
      return;
    }

    // TODO: validate singer data

    newSinger.id = singerId++;
    singersDatabase.push(newSinger);

    res.status(201).send(newSinger);
  });
};
