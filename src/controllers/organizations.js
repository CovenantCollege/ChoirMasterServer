module.exports = function organizationsController(app) {
  app.get('/organizations', async (req, res) => {
    res.send(await req.organizations.findAll(req.authentication.email));
  });

  app.post('/organizations', async (req, res) => {
    let user = await req.users.findByEmail(req.authentication.email);

    let newOrganizationId;

    try {
      newOrganizationId = await req.organizations.insert(user.userId, req.body);
    } catch (e) {
      res.status(400).send({ error: e.message || 'Error creating organization' });
      return;
    }

    res.status(201).send(await req.organizations.find(newOrganizationId));
  });
};
