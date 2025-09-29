const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcryptjs');

/**
 * Registrazione utente
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Controllo email già esistente
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    // Hash della password
    //const salt = await bcrypt.genSalt(10);
    //const hashedPassword = await bcrypt.hash(password, salt);

    // Creazione utente
    const newUser = await User.create({
      username,
      email,
      password, // in chiaro, verrà hashata dall'hook
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
    // Ritorna messaggio di errore più specifico se è un errore di validazione Sequelize
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
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Confronto password hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password errata' });
    }

    // Genera token JWT
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

module.exports = {
  register,
  login,
  logout
};
