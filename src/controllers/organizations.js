module.exports = function organizationsController(app) {
  app.get('/organizations', async (req, res) => {
    res.status(200).send(await req.organizations.findAll(req.authentication.email));
  });

  app.post('/organizations', async (req, res) => {
    let user = await req.users.findByEmail(req.authentication.email);
    let newOrganizationId = await req.organizations.insert(user.userId, req.body);

    res.status(201).send(await req.organizations.find(newOrganizationId));
  });
};
