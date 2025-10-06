const { Op } = require('sequelize');
const User = require('../models/User'); // importa il modello User
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../utils/email');

/**
 * Registrazione utente
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Controllo se email già esistente
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email già registrata' });

    // Creazione utente (password hashata da hook di Sequelize)
    const newUser = await User.create({
      username,
      email,
      password,
      role: 'user'
    });

    // Genera token JWT
    const token = generateToken({ userId: newUser.id, role: newUser.role });

    res.status(201).json({
      message: 'Utente registrato con successo',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      token
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
 * Login utente
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    // Confronta password
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
 * Recupero password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // DEBUG: mostra l'email ricevuta dalla richiesta
    console.log('Email richiesta reset:', email);

    if (!email) {
      return res.status(400).json({ message: 'Email mancante nella richiesta' });
    }

    // Trova l'utente nel DB
    const user = await User.findOne({ where: { email } });

    // DEBUG: mostra se l'utente è stato trovato
    console.log('Utente trovato:', user ? user.email : 'Nessuno');

    if (!user) {
      // Risposta generica per non rivelare se l'email esiste
      return res.status(200).json({ message: 'Se l’email esiste, riceverai un link per resettare la password' });
    }

    // Genera token temporaneo
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 ora

    await user.update({ resetToken, resetTokenExpires });

    // Link reset (frontend gestirà la pagina di reset)
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // DEBUG: mostra il link di reset
    console.log('Link reset generato:', resetURL);

    // Invia email
    await sendEmail({
      to: user.email,               // destinatario corretto
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

    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) return res.status(400).json({ message: 'Token non valido o scaduto' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password aggiornata con successo' });
  } catch (err) {
    console.error('Errore resetPassword:', err);
    res.status(500).json({ message: 'Errore nel reset password' });
  }
};

/**
 * Logout utente (JWT lato client)
 */
const logout = async (req, res) => {
  res.status(200).json({ message: 'Logout effettuato' });
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword
};
