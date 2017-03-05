let passwordGenerator = require('generate-password');
let sendInvitationEmail = require('../modules/invitationEmailSender');

module.exports = function usersController(app) {
  app.post('/users', async (req, res) => {
    if (await req.users.exists(req.body.email)) {
      res.status(403).send({ message: 'There is already a user with that email address' });
      return;
    }

    try {
      let userData = {
        email: req.body.email,
        password: passwordGenerator.generate({ length: 7, numbers: true })
      };

      await req.users.create(userData);
      await sendInvitationEmail(userData.email, userData.password);
    } catch (e) {
      res.status(400).send({ message: e.message || 'Error creating user' });
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
  //     res.status(400).send({ message: e.message || 'Error creating user' });
  //     return;
  //   }
  //
  //   res.status(200).send({ result: 'success' });
  // });

  // Used to change a user's password
  app.put('/users/password', async (req, res) => {
    let email = req.authentication.email;
    let user = await req.users.findByEmail(email);

    if (user.email != req.authentication.email) {
      res.status(403).send({ message: 'You can only change the password of your account' });
      return;
    }

    let { oldPassword, newPassword } = req.body;

    if (oldPassword == null || newPassword == null) {
      res.status(400).send({ message: 'Invalid json received.  Expected: { oldPassword, newPassword }' });
    }

    if (!await req.users.checkPassword(req.authentication.email, oldPassword)) {
      res.status(401).send({ message: 'The old password provided is not correct.' });
      return;
    }

    try {
      await req.users.changePassword(user.userId, newPassword);
    } catch (e) {
      res.status(500).send({ message: e.message || 'Error changing password' });
      return;
    }

    res.status(200).send({ result: 'success' });
  });
};
