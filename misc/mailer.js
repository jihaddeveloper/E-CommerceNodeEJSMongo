const nodemailer = require("nodemailer");
const configMailer = require("../config/configMailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  port: 25,
  auth: {
    user: configMailer.MAILGUN_USER,
    pass: configMailer.MAILGUN_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = {
  sendEmail(from, to, subject, html) {
    return new Promise((resolve, reject) => {
      transport.sendMail({ from, to, subject, html }, (error, info) => {
        if (error) return console.log(error);

        //console.log('The Email was sent');
        //console.log(info);
        resolve(info);
      });
    });
  }
};
