// utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Crea il transporter SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10), // Assicura che sia un numero
  secure: process.env.EMAIL_SECURE === 'true', // true se porta 465 (SSL), false per TLS/STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verifica la connessione al server SMTP
transporter.verify((error, success) => {
  if (error) {
    console.error('Errore connessione SMTP:', error);
  } else {
    console.log('Server SMTP pronto per inviare email');
  }
});

/**
 * Invia una email
 * @param {Object} options
 * @param {string} options.to - destinatario
 * @param {string} options.subject - oggetto della mail
 * @param {string} options.text - testo semplice
 * @param {string} [options.html] - testo HTML opzionale
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text, // se non viene passato HTML, usa il testo semplice
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email inviata: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Errore invio email:', error);
    throw new Error('Impossibile inviare l\'email');
  }
};

module.exports = { sendEmail };
