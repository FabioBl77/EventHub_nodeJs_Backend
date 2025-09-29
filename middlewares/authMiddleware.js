const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware per proteggere le rotte
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante o non valido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId e role dal token
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token non valido o scaduto' });
  }
};

module.exports = authMiddleware;
