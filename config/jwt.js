require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT
 * @param {Object} payload - Dati da includere nel token (es. userId, ruolo)
 * @param {string} expiresIn - Durata del token (opzionale, default dall'env)
 * @returns {string} token
 */
function generateToken(payload, expiresIn = process.env.JWT_EXPIRES_IN) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

/**
 * Verifica un token JWT
 * @param {string} token - Token ricevuto dal client
 * @returns {Object} payload decodificato
 * @throws {Error} se il token non è valido
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken
};
