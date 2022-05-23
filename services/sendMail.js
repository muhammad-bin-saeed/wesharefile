const emailTemp = require('./emailTemp');

const sendMail = (file) => {
    const nodemailer = require('nodemailer');
    const filePath = `${process.env.APP_URI || "http://localhost:3000"}/files/${file._id}`
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`
      }
    });
    const mailOptions = {
      from: `Node File Share <${file.sender}>`,
      to: file.receiver,
      subject: 'Node File Sharing app',
      text: 'You have received a file from ' + file.sender,
      html: emailTemp(file.sender, filePath, file.fileName, file.fileSize, "30 Minutes")
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

module.exports = sendMail;
