let HttpResponseError = require('../httpResponseError.js');

let passwordGenerator = require('generate-password');
let sendInvitationEmail = require('../modules/invitationEmailSender');

module.exports = function usersController(app) {
  app.post('/users', async (req, res) => {
    if (await req.users.exists(req.body.email)) {
      throw new HttpResponseError('FORBIDDEN', 'There is already a user with that email address');
    }

    let userData = {
      email: req.body.email,
      password: passwordGenerator.generate({ length: 7, numbers: true })
    };

    let userId = await req.users.create(userData);

    let orgId = req.body.orgId;
    if (!await req.users.isMemberOf(req.authentication.email, orgId)) {
      throw new HttpResponseError('FORBIDDEN', 'You are not authorized to invite users to that organization');
    }

    await req.organizations.addMember(req.body.orgId, userId);
    await sendInvitationEmail(userData.email, userData.password);

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

    let { oldPassword, newPassword } = req.body;

    if (oldPassword == null || newPassword == null) {
      throw new HttpResponseError('BAD_REQUEST', 'Invalid json received.  Expected: { oldPassword, newPassword }');
    }

    if (!await req.users.checkPassword(req.authentication.email, oldPassword)) {
      throw new HttpResponseError('UNAUTHORIZED', 'The old password provided is not correct');
    }

    await req.users.changePassword(user.userId, newPassword);

    res.status(200).send({ result: 'success' });
  });
};
