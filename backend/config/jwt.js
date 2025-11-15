require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT
 * @param {Object} payload 
 * @param {string} expiresIn 
 * @returns {string} token
 */
function generateToken(payload, expiresIn = process.env.JWT_EXPIRES_IN) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

/**
 * Verifica un token JWT
 * @param {string} token 
 * @returns {Object} 
 * @throws {Error} 
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken
};
