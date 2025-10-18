const { Op } = require('sequelize');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../utils/email');

/**
 * Registrazione utente con email di verifica
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Controllo se email già registrata
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email già registrata' });

    // 🔹 Generazione token di verifica PRIMA della creazione dell'utente
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 3600 * 1000; // 24h

    // Creazione utente con token già incluso
    const newUser = await User.create({
      username,
      email,
      password,
      role: 'user',
      isVerified: false,
      verificationToken,
      verificationTokenExpires
    });

    // URL di conferma email
    const verificationURL = `${process.env.FRONTEND_URL}/confirm-email/${verificationToken}`;

    // Invio email di conferma
    await sendEmail({
      to: newUser.email,
      subject: 'Conferma registrazione EventHub',
      text: `Ciao ${newUser.username}, clicca qui per confermare la tua registrazione: ${verificationURL}`
    });

    res.status(201).json({
      message: 'Registrazione completata. Controlla la tua email per confermare l’account',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Errore registrazione:', err);
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
};

/**
 * Conferma email tramite token e invio email di benvenuto
 */
const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Trova utente con token valido e non scaduto
    const user = await User.findOne({
      where: {
        verificationToken: token,
        verificationTokenExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) return res.status(400).json({ message: 'Token non valido o scaduto' });

    // Aggiorna stato utente
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    // 🔹 Invia email di benvenuto dopo conferma registrazione
    await sendEmail({
      to: user.email,
      subject: 'Benvenuto su EventHub!',
      text: `Ciao ${user.username}, il tuo account è stato confermato con successo! Ora puoi accedere e iniziare a utilizzare EventHub.`
    });

    res.status(200).json({ message: 'Email confermata con successo. Email di benvenuto inviata.' });

  } catch (err) {
    console.error('Errore conferma email:', err);
    res.status(500).json({ message: 'Errore durante la conferma email' });
  }
};

/**
 * Login utente
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    if (!user.isVerified) return res.status(403).json({ message: 'Devi confermare la tua email prima di accedere' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password errata' });

    const token = generateToken({ userId: user.id, role: user.role });

    res.status(200).json({
      message: 'Login effettuato con successo',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Errore login:', err);
    res.status(500).json({ message: 'Errore durante il login' });
  }
};

/**
 * Logout utente (JWT lato client)
 */
const logout = async (req, res) => {
  res.status(200).json({ message: 'Logout effettuato' });
};

/**
 * Recupero password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email mancante nella richiesta' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(200).json({ message: 'Se l’email esiste, riceverai un link per resettare la password' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1h
    await user.update({ resetToken, resetTokenExpires });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset password EventHub',
      text: `Clicca qui per resettare la password: ${resetURL}`
    });

    res.status(200).json({ message: 'Se l’email esiste, riceverai un link per resettare la password' });
  } catch (err) {
    console.error('Errore forgotPassword:', err);
    res.status(500).json({ message: 'Errore nel recupero password' });
  }
};

/**
 * Reset password
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Trova l'utente con il token valido
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpires: { [Op.gt]: Date.now() }
      }
    });
    if (!user) return res.status(400).json({ message: 'Token non valido o scaduto' });

    // Genera hash della nuova password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Aggiorna la password e reset token
    await user.update({
      password: password,
      resetToken: null,
      resetTokenExpires: null
    });

    res.status(200).json({ message: 'Password aggiornata con successo' });
  } catch (err) {
    console.error('Errore resetPassword:', err);
    res.status(500).json({ message: 'Errore nel reset password' });
  }
};


/**
 * Callback OAuth Google
 */
const oauthGoogleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = generateToken({ userId: user.id, role: user.role });
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  } catch (err) {
    console.error('Errore OAuth Google callback:', err);
    res.status(500).json({ message: 'Errore durante il login con Google' });
  }
};

module.exports = {
  register,
  confirmEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  oauthGoogleCallback
};
