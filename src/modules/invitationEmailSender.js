let nodemailer = require('nodemailer');
let configuration = require('../../configuration.js');

function sendInvitationEmail(emailAddress, generatedPassword) {
  let transporter = nodemailer.createTransport({
    service: configuration.email.transporter,
    auth: configuration.email.auth
  });

  let mailOptions = {
    from: 'choirmaster@covenant.edu',
    to: emailAddress,
    subject: 'Welcome to ChoirMaster',
    text: `Welcome to ChoirMaster, ${emailAddress}!  Your password is ${generatedPassword}`
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
}

module.exports = sendInvitationEmail;
