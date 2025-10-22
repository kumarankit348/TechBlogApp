const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
// !load environment variables from .env file in process object
dotenv.config();

const sendAccountVerificationEmail = async (to, verificationToken) => {
  try {
    //! create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER, // generated ethereal user
        pass: process.env.APP_PWD, // generated ethereal password
      },
    });

    // ! create the message to be sent
    const message = {
      to, // list of receivers
      subject: "Account verification Token", // Subject line
      html: `
  <b>Click on the link to verify your account:</b> 
  <a href="http://localhost:5173/verify/${verificationToken}">Verify Account</a>
`,
    };

    // ! send mail with defined transport object
    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendAccountVerificationEmail;
