// backend/utils/email.js
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY non impostata");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const DEFAULT_FROM =
  process.env.SENDGRID_FROM ||
  process.env.EMAIL_FROM ||
  "no-reply@eventhub.com";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await sgMail.send({
      to,
      from: DEFAULT_FROM,
      subject,
      text,
      html: html || text,
    });
    console.log(`Email inviata a ${to}`);
  } catch (error) {
    console.error("Errore invio email:", error);
    throw new Error("Impossibile inviare l'email");
  }
};

module.exports = { sendEmail };
