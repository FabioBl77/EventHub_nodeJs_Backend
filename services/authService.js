const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcryptjs');

/**
 * Registra un nuovo utente
 */
const registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error('Email già registrata');

  const newUser = await User.create({ username, email, password });
  const token = generateToken({ userId: newUser.id, role: newUser.role });

  return { user: newUser, token };
};

/**
 * Effettua il login dell'utente
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Utente non trovato');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Password errata');

  const token = generateToken({ userId: user.id, role: user.role });
  return { user, token };
};

module.exports = {
  registerUser,
  loginUser
};
