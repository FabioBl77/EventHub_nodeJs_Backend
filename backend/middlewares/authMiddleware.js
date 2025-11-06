const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware per proteggere le rotte
 */
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Token mancante o non valido' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(401).json({ message: 'Utente non trovato' });
    if (user.isBlocked) return res.status(403).json({ message: 'Utente bloccato' });

    req.user = { userId: user.id, role: user.role }; 
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token non valido o scaduto' });
  }
};


module.exports = authMiddleware;
