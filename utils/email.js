const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Invia una email
 * @param {string} to - destinatario
 * @param {string} subject - oggetto
 * @param {string} text - testo
 */
const sendEmail = async (to, subject, text) => {
  const info = await transporter.sendMail({
    from: `"EventHub" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
  console.log('Email inviata: %s', info.messageId);
  return info;
};

module.exports = { sendEmail };
