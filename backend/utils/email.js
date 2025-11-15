const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

transporter.verify((error) => {
  if (error) {
    console.error("Errore connessione SMTP:", error);
  } else {
    console.log("Server SMTP pronto per inviare email");
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: html || text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email inviata:", info.messageId);
    return info;
  } catch (error) {
    console.error("Errore invio email:", error);
    throw new Error("Impossibile inviare l'email");
  }
};

module.exports = { sendEmail };
