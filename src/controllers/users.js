let passwordGenerator = require('generate-password');
let sendInvitationEmail = require('../modules/invitationEmailSender');

module.exports = function usersController(app) {
  app.post('/users', async (req, res) => {
    let userPassword = passwordGenerator.generate({ length: 7, numbers: true });

    try {
      let userData = {
        email: req.body.email,
        password: userPassword
      };

      await req.users.create(userData);
      await sendInvitationEmail(userData.email, userPassword);
    } catch(e) {
      res.status(400).send({ error: e.message || 'Error creating user' });
      return;
    }

    res.status(201).send({
      result: 'success'
    });
  });

  // Used to edit a user's information: their email, for example.  This route
  //   is disabled for security reasons (currently it alows anyone to edit any
  //   account), but it can be fixed and enabled in the future.
  // app.put('/users/:id', async (req, res) => {
  //   try {
  //     await req.users.update(req.params.id, req.body);
  //   } catch (e) {
  //     res.status(400).send({ error: e.message || 'Error creating user' });
  //     return;
  //   }
  //
  //   res.status(200).send({ result: 'success' });
  // });

  // Used to change a user's password
  app.put('/users/:id/password', async (req, res) => {
    let userId = req.params.id
    let user = await req.users.find(userId);

    if (user.email != req.authentication.email) {
      res.status(403).send({ error: 'You can only change the password of your account' });
      return;
    }

    let { oldPassword, newPassword } = req.body;

    if (oldPassword == null || newPassword == null) {
      res.status(400).send({ error: 'Invalid json received.  Expected: { oldPassword, newPassword }' });
    }

    if (!await req.users.checkPassword(req.authentication.email, oldPassword)) {
      res.status(400).send({ error: 'The old password provided is not correct.' });
      return;
    }

    try {
      await req.users.changePassword(userId, newPassword);
    } catch (e) {
      res.status(500).send({ error: e.message || 'Error changing password' });
      return;
    }

    res.status(200).send({ result: 'success' });
  });
};
