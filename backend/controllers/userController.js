const User = require('../models/User');

/**
 * Recupera tutti gli utenti (solo admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'isBlocked', 'createdAt']
    });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore recupero utenti' });
  }
};

/**
 * Recupera profilo utente loggato
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'username', 'email', 'role', 'isBlocked', 'createdAt']
    });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore recupero profilo' });
  }
};

/**
 * Recupera utente per ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'role', 'isBlocked', 'createdAt']
    });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore recupero utente' });
  }
};

/**
 * Aggiorna ruolo utente (solo admin)
 */
const updateRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'Ruolo aggiornato', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore aggiornamento ruolo' });
  }
};

/**
 * Blocca o sblocca utente (solo admin)
 */
const blockUser = async (req, res) => {
  try {
    const { userId, block } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    user.isBlocked = block;
    await user.save();

    res.status(200).json({ message: `Utente ${block ? 'bloccato' : 'sbloccato'}`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore blocco/sblocco utente' });
  }
};

module.exports = {
  getAllUsers,
  getProfile,
  getUserById,
  updateRole,
  blockUser
};
